package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.AuthorMod;

/**
 * 朝代处理
 */
public interface AuthorDao
{

    List<AuthorMod> getAuthorList(int id, int size);

    boolean addModel(AuthorMod model);

}
