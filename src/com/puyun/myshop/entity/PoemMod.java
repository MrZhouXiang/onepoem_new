package com.puyun.myshop.entity;


/**
 * 诗词对象
 * 
 * @author Administrator
 */
public class PoemMod {
	private String id; // 主键
	private String author_id; // 外键 诗人id
	private String author_name; // 诗人name
	private String title; // 标题
	private String content; // 内容
	private String url; // 图片地址
	
	
	
	public String getAuthor_name() {
		return author_name;
	}
	public void setAuthor_name(String author_name) {
		this.author_name = author_name;
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
	public String getAuthor_id() {
		return author_id;
	}
	public void setAuthor_id(String author_id) {
		this.author_id = author_id;
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
	
	

}
