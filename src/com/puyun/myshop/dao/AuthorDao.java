package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.AuthorMod;

/**
 * 朝代处理
 */
public interface AuthorDao
{

    List<AuthorMod> getAuthorList(int id, int size, int page);
    List<AuthorMod> getAuthorList(String keyword, int start, int num);

    boolean addModel(AuthorMod model);
    boolean updateAuthor(AuthorMod model);
    
    AuthorMod getAuthor(int id);
}
