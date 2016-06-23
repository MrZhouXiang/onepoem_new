package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.PoemMod;

/**
 * 诗文处理
 */
public interface PoemDao {

	/**
	 * app
	 * 
	 * @param id
	 * @param size
	 * @param page
	 * @param dynasty_id
	 * @return
	 */
	List<PoemMod> getPoemList(int id, int size, int page, int dynasty_id);

	PoemMod getPoem(int id);

	/**
	 * web
	 * @param keyword
	 * @param start
	 * @param num
	 * @return
	 */
	List<PoemMod> getPoemList(String keyword, int start, int num);

	boolean addModel(PoemMod model);

	boolean updateModel(PoemMod model);

	boolean deleteModel(int id);

}
