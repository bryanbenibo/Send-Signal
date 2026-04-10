const fs = require('fs');
const path = require('path');

const designTokensPath = path.join(__dirname, 'design-tokens.tokens.json');
const colorTokensPath = path.join(__dirname, 'Color-token.json');
const outputPath = path.join(__dirname, 'theme.css');

/**
 * Prepares the unified Design System CSS.
 */
function generateDesignSystem() {
    if (!fs.existsSync(designTokensPath) || !fs.existsSync(colorTokensPath)) {
        console.error('Error: Required token files missing.');
        process.exit(1);
    }

    const designData = JSON.parse(fs.readFileSync(designTokensPath, 'utf8'));
    const colorData = JSON.parse(fs.readFileSync(colorTokensPath, 'utf8'));

    let cssOutput = `/* Unified Design System - Generated */\n\n`;

    function toKebabCase(str) {
        return str
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Split camelCase
            .toLowerCase()
            .replace(/[\s\.\(\)]+/g, '-') // Replace spaces, dots, parens with dash
            .replace(/-+/g, '-') // Simplify multiple dashes
            .replace(/^-|-$/g, ''); // Trim leading/trailing dashes
    }

    const rootVariables = [];
    const darkVariables = [];

    // --- Helper: Resolve Color References ---
    function resolveColorValue(val, tokens) {
        if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
            const keys = val.replace(/[{}]/g, '').split('.');
            let current = tokens;
            for (const key of keys) {
                if (current[key]) {
                    current = current[key];
                } else {
                    // Try case-insensitive match for the key
                    const foundKey = Object.keys(current).find(k => k.toLowerCase() === key.toLowerCase());
                    if (foundKey) {
                        current = current[foundKey];
                    } else {
                        return val; // Token not found
                    }
                }
            }
            return resolveColorValue(current, tokens);
        }
        return val;
    }

    // --- Helper: Format Shadow Value ---
    function formatShadow(shadow) {
        const { offsetX, offsetY, radius, spread, color } = shadow;
        // Convert hex8 (#rrggbbaa) to rgba if needed, but modern CSS handles hex8
        return `${offsetX}px ${offsetY}px ${radius}px ${spread}px ${color}`;
    }

    // --- Helper: Format Gradient Value ---
    function formatGradient(gradient) {
        const { stops, rotation } = gradient;
        // Simple conversion: Figma rotation to CSS linear-gradient angle
        // This is an approximation; complex gradients might need more math
        const angle = Math.round(rotation) + 'deg';
        const stopsStr = stops.map(s => `${s.color} ${Math.round(s.position * 100)}%`).join(', ');
        return `linear-gradient(${angle}, ${stopsStr})`;
    }

    // --- 1. Process Color Tokens (Roles & Palette) ---
    // Palettes
    for (const [name, tones] of Object.entries(colorData.color.palette)) {
        for (const [tone, value] of Object.entries(tones)) {
            rootVariables.push(`  --sys-palette-${toKebabCase(name)}-${tone}: ${value};`);
        }
    }

    // Light Roles (Root)
    for (const [role, value] of Object.entries(colorData.color.role.light)) {
        const resolved = resolveColorValue(value, colorData);
        rootVariables.push(`  --sys-color-${toKebabCase(role)}: ${resolved};`);
    }

    // Dark Roles (Themed)
    for (const [role, value] of Object.entries(colorData.color.role.dark)) {
        const resolved = resolveColorValue(value, colorData);
        darkVariables.push(`  --sys-color-${toKebabCase(role)}: ${resolved};`);
    }

    // --- 2. Process Design Tokens (Typography, Grid, Gradients, Effects) ---
    function extractDesignTokens(obj, currentPath = []) {
        for (const [key, val] of Object.entries(obj)) {
            const nextPath = [...currentPath, key];
            const pathStr = nextPath.join('.');

            // Skip "color" in design tokens as we use Color-token.json for colors
            if (nextPath[0] === 'color') continue;

            if (val && typeof val === 'object' && ('value' in val) && !Array.isArray(val.value)) {
                const varName = `--sys-${toKebabCase(nextPath.join('-'))}`;
                let varValue = val.value;

                // Handle Units
                if (val.type === 'dimension' || typeof varValue === 'number') {
                    const isUnitless = nextPath.some(p => p.toLowerCase().includes('weight') || p.toLowerCase().includes('count'));
                    if (varValue !== 0 && !isUnitless) {
                        varValue = `${varValue}px`;
                    }
                }

                // Handle Custom Types
                if (val.type === 'custom-shadow') {
                    varValue = formatShadow(val.value);
                } else if (val.type === 'custom-gradient') {
                    varValue = formatGradient(val.value);
                }

                if (typeof varValue === 'object' && val.type !== 'custom-shadow' && val.type !== 'custom-gradient') {
                    // For nested objects like grid values
                    for (const [subKey, subVal] of Object.entries(varValue)) {
                        let subVarValue = subVal;
                        const isSubUnitless = subKey.toLowerCase().includes('weight') || subKey.toLowerCase().includes('count');
                        if (typeof subVarValue === 'number' && subVarValue !== 0 && !isSubUnitless) {
                            subVarValue = `${subVarValue}px`;
                        }
                        rootVariables.push(`  ${varName}-${toKebabCase(subKey)}: ${subVarValue};`);
                    }
                } else {
                    rootVariables.push(`  ${varName}: ${varValue};`);
                }
            } else if (val && typeof val === 'object' && !('value' in val)) {
                // Check if this is a multi-shadow effect (keys are numbers)
                const childrenKeys = Object.keys(val);
                if (childrenKeys.length > 0 && childrenKeys.every(k => !isNaN(k))) {
                    const varName = `--sys-${toKebabCase(nextPath.join('-'))}`;
                    const shadows = childrenKeys
                        .sort((a, b) => Number(a) - Number(b))
                        .map(k => {
                            const v = val[k];
                            return v.type === 'custom-shadow' ? formatShadow(v.value) : null;
                        })
                        .filter(Boolean);
                    if (shadows.length > 0) {
                        rootVariables.push(`  ${varName}: ${shadows.join(', ')};`);
                    }
                } else {
                    extractDesignTokens(val, nextPath);
                }
            }
        }
    }

    extractDesignTokens(designData);

    // --- 3. Assemble Output ---
    cssOutput += `:root {\n${rootVariables.join('\n')}\n}\n\n`;
    cssOutput += `[data-theme="dark"] {\n${darkVariables.join('\n')}\n}\n`;

    fs.writeFileSync(outputPath, cssOutput);
    console.log(`Success: Generated ${outputPath} with ${rootVariables.length + darkVariables.length} variables.`);
}

generateDesignSystem();
