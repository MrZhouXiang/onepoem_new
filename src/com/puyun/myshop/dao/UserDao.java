package com.puyun.myshop.dao;

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
}
