import React from "react";
import { Table } from "antd";
import styles from "./style/dataTable.module.css";

const DataTable = ({ data = [], columns = [], loading = false }) => {
  return (
    <div className={styles.tableContainer}>
      <Table
        rowKey={(record) => record._id || record.id}
        dataSource={Array.isArray(data) ? data : []}
        columns={columns}
        loading={loading}
        bordered={false}
        scroll={{
          x: 750,
        }} /* Enables smooth horizontal scroll inside container */
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          responsive: true,
        }}
      />
    </div>
  );
};

export default DataTable;
