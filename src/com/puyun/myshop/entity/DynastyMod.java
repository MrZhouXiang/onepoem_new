package com.puyun.myshop.entity;

import java.sql.Date;

/**
 * 
 * 朝代
 * 
 * @author Administrator
 * 
 */
public class DynastyMod {

	public DynastyMod() {
	}

	public DynastyMod(String id, String name) {
		this.id = id;
		this.name = name;

	}

	private String id; // 主键
	private String name; // 名字
	private Date begin_time; // 开始时间
	private Date end_time; // 结束时间

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getBegin_time() {
		return begin_time;
	}

	public void setBegin_time(Date begin_time) {
		this.begin_time = begin_time;
	}

	public Date getEnd_time() {
		return end_time;
	}

	public void setEnd_time(Date end_time) {
		this.end_time = end_time;
	}

}
