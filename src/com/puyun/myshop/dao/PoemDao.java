package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.PoemMod;

/**
 * 诗文处理
 */
public interface PoemDao
{

    List<PoemMod> getPoemList(int id, int size, int page);

    PoemMod getPoem(int id);

    List<PoemMod> getPoemList(String keyword, int start, int num);

    boolean addModel(PoemMod model);

    boolean updateModel(PoemMod model);
    
    boolean deleteModel(int id);

}
