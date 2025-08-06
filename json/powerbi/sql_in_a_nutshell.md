SQL (Structured Query Language) is a powerful, declarative language used by data analytics professionals to communicate with and manipulate relational databases. It's the primary tool for extracting, transforming, and analyzing data to uncover insights. Here's a breakdown of key SQL concepts.

## SELECT & Filtering

The `SELECT` statement is the foundation of SQL, used to retrieve data from one or more tables. The `FROM` clause specifies the table, and the `WHERE` clause is used for **filtering**, which narrows down the result set to rows that meet specific conditions. You can use operators like `=`, `!=`, `>`, `<`, `AND`, `OR`, `NOT`, `LIKE` (for pattern matching), and `IN` (for a list of values) to define these conditions.
\<br\>

```sql
SELECT
  column1,
  column2
FROM
  tableName
WHERE
  column1 = 'value' AND column2 > 100;
```

This query retrieves `column1` and `column2` from `tableName`, but only for rows where `column1` is 'value' and `column2` is greater than 100.

-----

## JOINS

**JOINS** are used to combine rows from two or more tables based on a related column between them. .

  * **INNER JOIN**: Returns only the rows where there's a match in **both** tables.
  * **LEFT JOIN**: Returns all rows from the **left** table and the matched rows from the right table. If there's no match, the columns from the right table will be `NULL`.
  * **RIGHT JOIN**: The opposite of a left join. Returns all rows from the **right** table and the matched rows from the left table.

-----

## Grouping & Aggregation

**GROUP BY** is used to group rows that have the same values in specified columns into summary rows, like "count the number of customers in each city." **Aggregation** functions then perform a calculation on these grouped values, such as `COUNT()`, `SUM()`, `AVG()`, `MIN()`, and `MAX()`. The `HAVING` clause is used to filter these grouped results, similar to how `WHERE` filters rows.
\<br\>

```sql
SELECT
  city,
  COUNT(customerId) AS totalCustomers
FROM
  customers
GROUP BY
  city
HAVING
  COUNT(customerId) > 10;
```

This query counts the number of customers in each city and only shows cities with more than 10 customers.

-----

## Subqueries

A **subquery** (or nested query) is a query within another query. It can be used in the `FROM`, `WHERE`, or `SELECT` clauses. Subqueries are great for breaking down complex problems and can act as a temporary table or a filtered list.
\<br\>

```sql
SELECT
  productName
FROM
  products
WHERE
  productId IN (
    SELECT
      productId
    FROM
      sales
    WHERE
      saleDate = '2025-01-01'
  );
```

This query finds all products that were sold on January 1, 2025, by first getting a list of `productId`'s from the `sales` table.

-----

## CASE Statements

A **`CASE` statement** is a conditional expression that allows you to perform **if/then/else** logic within your SQL query. It's excellent for creating new categories, handling different scenarios, or transforming data on the fly.
\<br\>

```sql
SELECT
  productName,
  price,
  CASE
    WHEN price > 50 THEN 'Expensive'
    WHEN price > 20 THEN 'Moderate'
    ELSE 'Affordable'
  END AS priceCategory
FROM
  products;
```

This statement assigns a text label ('Expensive', 'Moderate', 'Affordable') to each product based on its price.

-----

## Window Functions

**Window functions** perform a calculation across a set of table rows that are somehow related to the current row. Unlike aggregate functions with `GROUP BY`, they **don't collapse the rows** of the result set. They are powerful for ranking (`RANK()`), calculating moving averages, or finding cumulative totals. The `OVER()` clause defines the "window" or set of rows the function operates on.
\<br\>

```sql
SELECT
  productName,
  sales,
  RANK() OVER (ORDER BY sales DESC) AS salesRank
FROM
  productSales;
```

This query assigns a rank to each product based on its sales, without reducing the number of rows.

-----

## Stored Procedures

A **stored procedure** is a pre-compiled set of SQL statements saved in the database. Think of it as a function or a macro for your database. Stored procedures are useful for encapsulating complex logic, improving performance (as they're pre-compiled), enhancing security, and ensuring data integrity and consistency.

-----

## Views

A **view** is a virtual table created by a query. It doesn't store data itself but instead provides a simplified, logical representation of data from one or more underlying tables. Views are used for simplifying complex queries, controlling access to sensitive data (by only showing certain columns), and presenting data in a specific format for reporting.

-----

## Triggers

A **trigger** is a special type of stored procedure that is automatically executed in response to certain events on a table, such as an `INSERT`, `UPDATE`, or `DELETE`. Triggers are often used to enforce business rules, maintain data integrity, and automatically update related tables, such as logging changes or auditing.