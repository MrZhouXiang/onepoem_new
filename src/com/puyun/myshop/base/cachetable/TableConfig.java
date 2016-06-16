package com.puyun.myshop.base.cachetable;

import java.util.ArrayList;
import java.util.List;

class TableConfig {
	private String tableName;
	private List<String> columnNames = new ArrayList<String>();
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public boolean addColumnName(String columnName) {
		return columnNames.add(columnName);
	}
	public List<String> getColumnNames(){
		return this.columnNames;
	}
	
	public String toString(){
		return "{tableName:"+tableName+",columnNames:"+columnNames+"}";
	}
}
