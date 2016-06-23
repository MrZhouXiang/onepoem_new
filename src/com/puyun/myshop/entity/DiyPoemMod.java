package com.puyun.myshop.entity;

import java.sql.Date;

/**
 * 诗词对象
 * 
 * @author Administrator
 */
public class DiyPoemMod {
	private String id; // 主键
	private String user_id; // 外键 诗人id
	private String title; // 标题
	private String content; // 内容
	private String url; // 图片地址
	private String is_publish; //是否公开
	private Date creat_time;// 发布时间
	private String tag; //标签
	private int type; //类型0:普通诗词，只有一张图片	1:图文混编诗词，content存储的是json
	private int status; //状态

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public Date getCreat_time() {
		return creat_time;
	}

	public void setCreat_time(Date creat_time) {
		this.creat_time = creat_time;
	}

	public String getIs_publish() {
		return is_publish;
	}

	public void setIs_publish(String is_publish) {
		this.is_publish = is_publish;
	}

	
	
}
