# DGen - a Bootstrap Dialog Generator
## From Oddbeaker LLC

Converts a simple "DGen" markup notation to a Bootstrap modal dialog and a javascript object that can hide, display, populate and fetch all form field data. 

Here is an example of DGen notationn that contains all supported form field types:

    <{User Information}>
    <{Please fill in the information below:}>
    <{First Name:}{[T:firstName,50]}>
    <{Age:}{[N:age,18,100]}>
    <{Height (in meters):}{[F:height,1.0,2.5]}>
    <{Password:}{[P:password,50]}>
    <{Bio:}{[A:bio,5]}>
    <{Interests:}
    {[X:reading] Reading}
    {[X:travel] Travel}
    {[X:cooking] Cooking}>
    <{Gender:}
    {[R:gender1,gender,male] Male}
    {[R:gender2,gender,female] Female}
    {[R:gender3,gender,other] Other}>
    <{Preferred Language:}
    {[D:language]}>
    <{[B:cancelButton,Cancel][B:saveButton,Save]}>

The above DGen notation will produce this:

![feature X](https://oddbeaker.com/vscode-ext/vscode-dgen.png)

---

## Instructions

1. Type your DGen directly into your HTML file, at the point where you want the code generated. 
2. Select the block of DGen text.
3. Press Alt-Shift-D and POOF! Instant modal dialog with all the code needed to handle it.
4. Style your generated HTML as needed.
5. Fill in your change and click handlers as needed.

That's it!

---

## DGen notation reference

- Rows are surrounded by "<" and ">".
- Columns are surrounded by "{" and "}".
- Form fields are surrounded by "[" and "]".
- Any text within a column is copied as it appears.
- The first row of the dialog must have a single column with title that will be used to calculate the dialog and object names. For example:

    >
    > <{User Information}>
    >

- The last row of the dialog will become the footer. It must have a single column containing buttons such as the Save and Cancel buttons. For example:

    >
    > <{[B:cancelButton,Cancel][B:saveButton,Save]}>
    >

---

## DGen field reference
- **[A:id,rows]** - Textarea with ID and number of rows.

- **[B:id,label]** - Button with ID and label.

- **[D:id]** - Dropdown list with ID.

- **[F:id,min,max]** - Number field with ID and min, max parameters.

- **[N:id,min,max]** - Integer field with ID and min, max parameters.

- **[P:id,length]** - Password field with ID and length (maxlength) parameters.

- **[R:id,group,value]** - Radio button with ID, group, and value parameters.

- **[T:id,length]** - Text field with ID and length parameters.

- **[X:id]** - Checkbox with ID 

---

## Notes

- Use the example DGen at the beginning of this document as a reference for how to use each of the form field types, column layout, etc.

- The first and last DGen rows will become the modal header and footer, respectively. These must both contain a single column.

- Dropdowns are generated with no item. You can add items after generating the HTML code.

- Bootstrap columns are generated with no column width (e.g.: \<div class="col"> instead of \<div class="col-6">). It is up to you to tweak the columns to your liking.

- Text within columns has no styling whatsoever. You can style them as needed or wrap them in a <label> tag, for example.

- The DGen parser ignores whitespace between rows and columns, but not within columns. 

---

## Known Issues

- Empty columns "{}" will not generate a column in the HTML. To force a column to be generated, put a space in between the curly brackets. "{ }"

- There is absolutely no check for malformed DGen notation, and no proper error handling yet. 

- Radio buttons work but the generated code needs improvement. Currently, it will generate an object property for each radio button with no regard to groups. Experiment with them before using them in production.

---

## Release Notes

### 1.0.0

Initial release.

---

**Enjoy!**

