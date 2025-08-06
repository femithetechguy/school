# Most Common M-Language Queries

M Language, also known as Power Query M formula language, is the language used in Power Query for data transformation. It's a powerful, functional, and case-sensitive language that underlies the graphical interface of the Power Query Editor in tools like Power BI and Excel.

While you can do a lot of data transformation by just clicking buttons in the Power Query Editor, the M code is what gets written behind the scenes. Learning some M can be extremely helpful for more advanced scenarios that aren't possible with the GUI alone.

Here's a basic example of M Language syntax:

```
let
    Source = Csv.Document(File.Contents("C:\my_data.csv"),[Delimiter=",", Columns=5, Encoding=1252, QuoteStyle=Csv.QuoteStyle.None]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{% raw %}{{"Column1", type text}, {"Column2", type number}}{% endraw %}),
    Result = #"Changed Type"
in
    Result
```

## Common M Language Concepts

Here are some of the most common concepts and elements you'll encounter in M language:

### 1\. `let...in` Expression

This is the fundamental structure of an M query. It defines a series of steps (variables) and then specifies the final output.

  * `let`: Starts the block where you define your steps.
  * `Source = ...`: Each step is a variable assignment, where `Source` is a common starting point. You can name these variables whatever you like.
  * `#"Promoted Headers" = ...`: Variable names with spaces or special characters must be enclosed in quotes and prefixed with a `#`.
  * `in`: Specifies which variable holds the final result of the query. Typically, this is the last step you performed.

**Example:**

```m
let
    Source = Csv.Document(File.Contents("C:\my_data.csv"),[Delimiter=",", Columns=5, Encoding=1252, QuoteStyle=Csv.QuoteStyle.None]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{% raw %}{{"Column1", type text}, {"Column2", type number}}{% endraw %}),
    Result = #"Changed Type"
in
    Result
```

### 2\. Common Functions

M has a vast library of functions, many of which are grouped by the data type they operate on (e.g., `Table.`, `List.`, `Text.`).

  * **`Table.Source`**: A core function for connecting to data sources.
  * **`Table.TransformColumnTypes`**: Changes the data type of columns.
  * **`Table.RenameColumns`**: Renames columns.
  * **`Table.SelectRows`**: Filters rows based on a condition. The `each` keyword is often used here.
  * **`Table.AddColumn`**: Creates a new column, often using conditional logic.
  * **`Table.Group`**: Groups rows and performs aggregations.
  * **`Table.Combine`**: Appends tables.
  * **`List.Combine`**: Combines multiple lists into one.
  * **`Text.Proper`**: Capitalizes the first letter of each word in a text string.
  * **`Date.AddDays`**: Adds a specified number of days to a date.

### 3\. Conditional Statements

The `if...then...else` construct is used to create conditional logic. This is very common when creating custom columns.

**Example:**

```m
if [Sales] > 1000 then "High" else "Low"
```

You can also nest `if` statements for more complex logic.

```m
if [Region] = "East" then "Eastern Region" else if [Region] = "West" then "Western Region" else "Other"
```

### 4\. The `each` Keyword

`each` is a shorthand for creating a simple function. It's often used with functions like `Table.SelectRows` or `Table.AddColumn`.

  * `each [Sales] > 1000` is shorthand for `(_) => _[Sales] > 1000`. It creates a function that takes a single input (represented by `_`) and returns a logical value based on the condition.

### 5\. Data Types

M is a dynamically-typed language, but it's crucial to understand the available data types for effective transformation.

  * `type text`
  * `type number`
  * `type date`
  * `type datetime`
  * `type logical` (True/False)
  * `type any` (The default type before a specific type is assigned)

### 6\. Records and Lists

  * **Records:** A collection of named values, like a row in a table. They are defined with square brackets: `[Column1 = "Value1", Column2 = 123]`. You access a record's value using the lookup operator: `[Column1]`.
  * **Lists:** An ordered sequence of values. They are defined with curly brackets: `{1, 2, 3}`. You access an item by its zero-based index: `{1, 2, 3}{0}` would return `1`.