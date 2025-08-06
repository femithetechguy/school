Power BI has a variety of filters that can be applied to a report at different levels, giving you granular control over the data users see. These filters are organized in the **Filters pane**, which typically appears on the right side of the screen in Power BI Desktop and the Power BI service.

Here are the main types of filters in Power BI, categorized by their scope:

### **1. Report-Level Filters**
These are the highest-level filters and they affect **all visuals on every page** of the entire report. They're useful for applying a universal filter, such as filtering for a specific year or region across all your data. To apply a report-level filter, you drag a field into the "Filters on all pages" section of the Filters pane.

### **2. Page-Level Filters**
These filters are more targeted and only apply to **all the visuals on a single, specific report page**. They're great for creating pages that are focused on a particular subset of your data, for example, a page dedicated to sales performance in a single country. These filters are added to the "Filters on this page" section.

### **3. Visual-Level Filters**
This is the most specific type of filter, affecting only a **single visual** (like a chart, table, or card). Visual-level filters are automatically added to the Filters pane when you add a field to a visual. You can also manually add a field to the "Filters on this visual" section to filter a visual based on data not already present in it. 

---

### **Other Important Filter Types**

Beyond the main three, there are other types of filters that serve specific purposes in Power BI:

* **Slicers**: While technically a visual, slicers act as an interactive filter that users can directly see and interact with on the report canvas. Slicers can affect a single visual, all visuals on a page, or multiple pages, depending on their sync settings.
* **Drill-through Filters**: This type of filter allows users to navigate from a summary report page to a more detailed, target page. When a user right-clicks a data point and "drills through," the target page automatically filters to show details for that specific data point.
* **Advanced and Top N Filters**: These are **modes** of filtering that can be applied at any level (visual, page, or report). **Advanced filtering** allows for complex conditions using logical operators (e.g., "contains," "starts with," "is greater than"). **Top N filtering** lets you quickly display the top or bottom number of items based on a specific measure (e.g., "Top 10 products by sales").

In Power BI, you'll most often interact with **report-level**, **page-level**, and **visual-level** filters, using slicers for user interaction and drill-through for deeper analysis.

This video provides an excellent overview of the three main levels of filters in Power BI. [Understanding 3 Levels of Filters in Power BI](https://www.youtube.com/watch?v=bI7F0ObuPcw)
http://googleusercontent.com/youtube_content/0