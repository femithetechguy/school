Power BI's data import limitations depend heavily on your license type and the connection mode you're using. The primary limitation for imported data is the **dataset size limit** when published to the Power BI Service.

### Power BI Pro and Shared Capacity
With a Power BI Pro license, the size of a single dataset is limited to **1 GB**. This is a hard limit for any report you publish to a workspace that uses a shared capacity. This limit applies to the compressed size of the data after it's been imported and loaded into the Power BI engine, not the original source file size.

### Power BI Premium and Premium Per User (PPU)
Power BI Premium and Premium Per User (PPU) licenses offer significantly higher limits. For these licenses, the default maximum dataset size is **10 GB**. However, by enabling the "large semantic model storage format" in the workspace settings, you can increase this limit to the maximum memory size of your Premium capacity, which can be up to **400 GB** or even higher depending on your SKU.

---

### Other Important Limitations ⚠️
* **Power BI Desktop:** While the Power BI Service has strict limits, the only practical limit for a data model in Power BI Desktop is the amount of **RAM** on your computer. You can work with much larger files locally, but you won't be able to publish them to the Power BI Service if they exceed your license's limit.
* **DirectQuery:** Using DirectQuery mode bypasses the dataset size limitations of imported data because it doesn't store the data in the Power BI Service. Instead, it queries the data directly from the source whenever you interact with a report. This is a common strategy for working with very large datasets. However, DirectQuery has its own limitations, such as a **1 million row limit** for data returned from cloud data sources and slower performance compared to import mode.
* **Data Refresh:** The number of daily data refreshes is also a limitation. For a Power BI Pro license, you're limited to **8 refreshes per day**, while Premium and PPU licenses allow up to **48 refreshes per day**. This is a crucial factor for dashboards and reports that require near-real-time data.
* **Columns and Rows:** There's a maximum of **16,000 columns** across all tables in a single dataset. For rows, the maximum is **2 billion** when not using DirectQuery.