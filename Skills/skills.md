# General Skills rules
This files defines baseline engineering and product standands aplied accross this repository. 

## Code Organization
Reaadable, maintainable, and testable code is the priority. 

Largt files are avoided. Features are organised into modules such as

- Leads
- Templates
- Campaigns
- Setting 

## Naming Conventions

- Files are named in kebab-case
- components are named in PascalCase
- Functions and variables are named in camelCase
- Constants are named in UPPER_SNAKE_CASE
- variables are named in camelCase
 
 ## Data Validation
 Client input is never trusted. All data must be validated and sanitized before use. 

 Validation occors at the server-side before data becomes persistent or before message is sent out to users

 Phone numbers are normalized before storage 

 Messaging operations include idempotency safe guards

 ## Compliance Enforcement
 Messaging operations must respect opt-in and unsubscribe requirements

 Unsubscribe keywords include STOP, UNSUBSCRIBE, CANCEL, END, QUIT

 Duplicate messages are to be prevented 

 ## User Interface rules

UI styling follows the design tokens defined in design-tokens.tokens.json 
 
 color usage must refrence tokens defined in design-tokens.tokens.json

 Typography usage must refrence tokens defined in design-tokens.tokens.json

 Direct use of tailwind classes is forbidden. All styling must be done using the design tokens. 

 if radii, shadows, boarder sapcing are bot available in the design tokens. then tailwind classes can be used. 

 Direct hex color usage is prohibited 
 Arbitrary values are prohibited 

 ## Product Safety rules 
 Large message send must request user confirmation
 
 Campaign execution will have controls for 
 - pause
 - resume
 - stop
 - cancel
 - reset 
 - see progress review 

 ## Test expectations 
 
Each feature includes verification of 
- successful primary workflow
- invalid input behavior
- compliance behavior
- edge case behavior


 