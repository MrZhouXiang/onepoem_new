package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.PoemMod;

/**
 * 一首小诗APP接口
 * 
 */
public interface AppDao {


	List<PoemMod> getPoemList(int id, int size);

}
