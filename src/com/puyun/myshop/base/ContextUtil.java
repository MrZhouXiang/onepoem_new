package com.puyun.myshop.base;

import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import com.puyun.myshop.base.util.PropertiesUtils;
import com.puyun.myshop.base.util.Utils;

public class ContextUtil
{
    /**
     * 判断账号是不是超级管理员
     * 
     * @param account 用户账号
     * @return true：是超级管理员 false：其他
     * @see [类、类#方法、类#成员]
     */
    public static final boolean isSuperAdmin(String account)
    {
        if (Utils.isEmpty(account))
        {
            return false;
        }
        
        Properties prop = PropertiesUtils.getProperties("/system-config.properties");
        String username = prop.getProperty(Constants.SYSTEM_USER);
        return account.equals(username);
    }
    
    
    /**
     * 当前用户是否是超级管理员
     * 
     * @param req
     * @return
     * @see [类、类#方法、类#成员]
     */
//    public static final boolean isSuperAdmin(HttpServletRequest req)
//    {
//    	AdminUser user = getLoginInfo(req);
//        
//        return user != null && isSuperAdmin(user.getLoginName());
//    }
    
    
    /**
     * 获取后台管理中已登录用户的信息
     * 
     * @param req
     * @return
     * @see [类、类#方法、类#成员]
     */
//    public static final AdminUser getLoginInfo(HttpServletRequest req)
//    {
//        Object user = req.getSession().getAttribute(Constants.USER_INFO_SESSION);
//        if (user != null)
//        {
//            return (AdminUser)user;
//        }
//        
//        return null;
//    }
    
}
