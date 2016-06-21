package com.puyun.myshop.dao;

import java.util.List;

import com.puyun.myshop.entity.AuthorMod;
import com.puyun.myshop.entity.UserMod;

/**
 * 用户管理相关数据访问接口
 * 
 * @author zx 创建时间: 2015-2-28
 */
public interface UserDao
{
    boolean isExit(String account, int type);

    boolean addOneUser(String account, String pwd, int type);

    UserMod getOneUser(String account, String pwd, int type);

	List<UserMod> getUserList(String keyword, int start, int num);

	UserMod getUser(int id);

	boolean updateUser(UserMod model);
}
