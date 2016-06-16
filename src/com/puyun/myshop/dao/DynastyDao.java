package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.DynastyMod;

/**
 * 诗文处理
 */
public interface DynastyDao
{

    List<DynastyMod> getDynastyList(int id, int size);

}
