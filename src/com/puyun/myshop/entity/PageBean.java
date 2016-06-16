package com.puyun.myshop.entity;

public class PageBean
{
    private int pageSize = 15;// 每页大小   默认15
    
    private int currentPage = 1;// 当前页  默认第一页
    
    private int totalPage;// 总页数
    
    private int totalCount;// 总记录数
    
    public int getPageSize()
    {
        return pageSize;
    }
    
    public void setPageSize(int pageSize)
    {
        this.pageSize = pageSize;
    }
    
    public int getCurrentPage()
    {
        return currentPage;
    }
    
    public void setCurrentPage(int currentPage)
    {
        this.currentPage = currentPage;
    }
    
    public int getTotalPage()
    {
        return totalPage;
    }
    
    public int getTotalCount()
    {
        return totalCount;
    }
    
    public void setTotalCount(int totalCount)
    {
        this.totalCount = totalCount;
        this.totalPage = ((totalCount - 1) / pageSize) + 1;
    }
    
}
