package com.puyun.myshop.base.util;

import com.puyun.myshop.entity.PageBean;

public class DBUtil
{
    public static final String getPageString(PageBean page)
    {
        return " limit " + page.getPageSize() + " offset " + (page.getPageSize() * (page.getCurrentPage() - 1));
    }
}
