# Most Common DAX Functions in Power BI

DAX (Data Analysis Expressions) functions are the foundation of creating formulas and expressions in data models. While there are many functions available, certain ones are used more frequently for common business intelligence tasks in tools like Power BI.

## Top DAX Functions

### 1. CALCULATE

**CALCULATE** is arguably the most important and versatile DAX function. It evaluates an expression in a modified filter context. This function allows you to override or add filters to your calculations, which is essential for creating dynamic and meaningful measures. For example, you can use it to calculate the total sales for a specific region, regardless of any other filters on the report.

### 2. Aggregation Functions

These functions are used to summarize data and are often the building blocks of measures.

- **SUM:** Calculates the sum of all numbers in a column.
- **AVERAGE:** Calculates the arithmetic mean of a column's values.
- **COUNT:** Counts the number of rows that contain a value in a column.
- **DISTINCTCOUNT:** Counts the number of unique values in a column.
- **MIN/MAX:** Finds the smallest or largest value in a column, respectively.

### 3. Iterator Functions

Iterator functions, which are often recognizable by the "X" at the end of their name (e.g., **SUMX**, **AVERAGEX**), perform a calculation row by row within a table before aggregating the results. This is useful for more complex calculations, like calculating total revenue by multiplying the quantity and price for each row and then summing the results.

### 4. Time Intelligence Functions

Time intelligence functions help you analyze data over different time periods. They are crucial for creating comparisons and trends.

- **DATEADD:** Shifts a date range forward or backward in time, which is perfect for year-over-year or month-over-month comparisons.
- **DATESYTD/DATESMTD/DATESQTD:** These functions return a table of dates for the year-to-date, month-to-date, or quarter-to-date, respectively.
- **SAMEPERIODLASTYEAR:** Returns a set of dates in the previous year that are parallel to the dates in the specified date column.

### 5. Relationship Functions

These functions are used to navigate relationships between tables in your data model.

- **RELATED:** Retrieves a value from a related "one" side of a one-to-many relationship. It can only be used in a row context, such as within a calculated column.
- **RELATEDTABLE:** Returns an entire table of rows from the "many" side of a one-to-many relationship, which is useful for performing calculations on related data.

### 6. Logical and Information Functions

These functions are used for conditional logic and to check for certain data states.

- **IF:** Checks a condition and returns one value if true, and another if false.
- **SWITCH:** A more efficient alternative to nested IF statements, it compares an expression to a list of values and returns a corresponding result.
- **ISBLANK:** Checks if a value is blank.
- **DIVIDE:** This is a safer way to perform division, as it allows you to specify an alternate result to prevent errors when dividing by zero.

## Resources

[Learn 80% of DAX in an Hour](https://www.youtube.com/watch?v=lD7TvkoQ6rY)

This video is a tutorial for beginners that covers some of the most commonly used DAX functions.
