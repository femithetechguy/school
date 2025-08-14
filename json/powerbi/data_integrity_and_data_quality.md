# Data Integrity and Data Quality

Data integrity and data quality are related but distinct concepts crucial for effective data management. **Data integrity** focuses on the overall trustworthiness and reliability of data by ensuring its accuracy, consistency, and security across its entire lifecycle. It's about protecting data from unauthorized or accidental changes, essentially preserving its original state.

## Data Integrity

Data integrity is the assurance that data has not been corrupted or tampered with. It's the "backbone" that supports data's reliability. Think of it as a set of rules and processes designed to safeguard data. Key aspects include:

- **Accuracy:** The data is provably correct and reflects the real world.
- **Consistency:** Data values remain uniform across multiple systems and applications. For example, a customer's address should be the same in the CRM and the billing system.
- **Security:** Measures are in place to prevent unauthorized access, modification, or deletion of data. This includes access controls and encryption.
- **Completeness:** All required data is present and not missing important values.

Data integrity is enforced through various technical and procedural measures, such as:

- **Entity Integrity:** Ensuring each row in a database table has a unique primary key to prevent duplication.
- **Referential Integrity:** Maintaining consistent relationships between tables. For instance, you can't delete a customer record if there are still orders linked to it.
- **Domain Integrity:** Validating that data falls within an acceptable range or format (e.g., a ZIP code field only accepts five-digit numbers).

## Data Quality

**Data quality** measures how fit data is for its intended purpose. While data integrity ensures data is protected and consistent, data quality evaluates its usefulness for a specific business context. It's a more subjective and business-driven concept. Data can have high integrity (it's protected and hasn't been changed), but still have low quality if it's outdated or irrelevant to the task at hand.

Data quality is often assessed using several dimensions:

- **Accuracy:** Is the data correct and does it reflect reality?
- **Completeness:** Is all necessary data available? For example, is a customer's phone number and email address included in their profile?
- **Consistency:** Are data values uniform across different records and systems?
- **Timeliness:** Is the data current and available when needed for a decision?
- **Validity:** Does the data conform to the business rules and required formats?
- **Uniqueness:** Are there duplicate records for the same entity?

Data quality is managed through processes like **data profiling**, which identifies issues, and **data cleansing**, which corrects errors and inconsistencies.

## The Relationship Between the Two

Think of a library. **Data integrity** is like the library's security system: it ensures that books aren't stolen, damaged, or misplaced. It ensures that a book with a specific title is always in its designated spot, and that nobody can check it out without authorization. **Data quality** is about the books themselves: are they the most recent edition? Are they relevant to the readers' needs? Is the information inside them still correct? A book can have high integrity (it's protected and in the right place), but low quality if the information inside is outdated. For data to be truly useful, it needs both high integrity and high quality.
