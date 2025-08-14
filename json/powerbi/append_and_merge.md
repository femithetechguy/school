# Append and Merge Operations in Power Query

**Append** and **Merge** are two fundamental operations in Power Query (which is the data transformation engine in Power BI) used to combine data from multiple tables. The key difference lies in how they combine the data:

- **Append** combines tables vertically, adding rows from one table to the bottom of another.
  - **Use Case:** You use append when you have tables with the **same columns** but different rows, such as monthly sales data stored in separate files.
  - **Result:** The number of rows increases, but the number of columns remains the same.
  - **Analogy:** Think of appending as "stacking" one table on top of another.
- **Merge** combines tables horizontally, adding new columns from one table to another based on a common column.
  - **Use Case:** You use merge when you have tables with a **common column** (like an `OrderID` or `CustomerID`) but want to add different information from another table. This is similar to a `VLOOKUP` in Excel or a `JOIN` in SQL.
  - **Result:** The number of columns increases, and the number of rows depends on the type of join you perform (e.g., inner, left outer).
  - **Analogy:** Think of merging as "joining" tables side-by-side.

| Feature             | Append Queries                                                              | Merge Queries                                                              |
| ------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Direction** | Vertical (adds rows)                                                        | Horizontal (adds columns)                                                  |
| **Requirement** | Tables must have the same or similar column headers to be combined cleanly. | Tables must share at least one common column to match on.                  |
| **Result** | A single table with more rows.                                              | A single table with more columns.                                          |
| **SQL Equivalent** | `UNION ALL`                                                                 | `JOIN`                                                                     |
| **When to Use** | To consolidate similar data from multiple sources (e.g., quarterly sales).  | To enrich a table with additional data from another table (e.g., adding customer details to a sales table). |

## Resources

[Merge vs Append in Power BI: When to use each and why](https://www.youtube.com/watch?v=zegAxVk7jRY)

This video is relevant because it clearly explains the difference between merge and append queries in Power BI, including when and why to use each function.
