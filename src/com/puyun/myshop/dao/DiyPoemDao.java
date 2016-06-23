package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.DiyPoemMod;

/**
 * 诗文处理
 */
public interface DiyPoemDao {

	/**
	 * app
	 * 
	 * @param id
	 * @param size
	 * @param page
	 * @param dynasty_id
	 * @return
	 */
	List<DiyPoemMod> getDiyPoemList(int id, int size, int page, int dynasty_id);

	DiyPoemMod getDiyPoem(int id);

	/**
	 * web
	 * 
	 * @param keyword
	 * @param start
	 * @param num
	 * @return
	 */
	List<DiyPoemMod> getDiyPoemList(String keyword, int start, int num);

	boolean addModel(DiyPoemMod model);

	boolean updateModel(DiyPoemMod model);

	boolean deleteModel(int id);

}
