import React from "react";
import data from "./data_platform_administrator.json";

export default function DataPlatformAdministrator() {
  return (
    <div style={{ fontFamily: 'inherit', fontSize: 16, lineHeight: 1.7 }}>
      <h1>{data.role}</h1>
      <p>{data.summary}</p>
      <h2>Key Responsibilities</h2>
      <ul>
        {data.key_responsibilities.map((resp) => (
          <li key={resp.category}>
            <strong>{resp.category}</strong>
            <ul>
              {resp.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h2>Common Tools & Technologies</h2>
      <ul>
        <li><strong>BI Tools:</strong> {data.common_tools_and_technologies.bi_tools.join(", ")}</li>
        <li><strong>Cloud Platforms:</strong> {data.common_tools_and_technologies.cloud_platforms.join(", ")}</li>
        <li><strong>Databases:</strong> {data.common_tools_and_technologies.databases.join(", ")}</li>
        <li><strong>Data Movement:</strong> {data.common_tools_and_technologies.data_movement.join(", ")}</li>
        <li><strong>Admin Tools:</strong> {data.common_tools_and_technologies.admin_tools.join(", ")}</li>
        <li><strong>Scripting:</strong> {data.common_tools_and_technologies.scripting.join(", ")}</li>
      </ul>
      <h2>How It Differs from Other Roles</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Role</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Focus</th>
          </tr>
        </thead>
        <tbody>
          {data.role_comparison.map((row) => (
            <tr key={row.role}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.role}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.focus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
