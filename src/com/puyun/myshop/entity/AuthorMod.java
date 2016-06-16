package com.puyun.myshop.entity;

/**
 * 诗人
 * 
 * @author Administrator
 * 
 */
public class AuthorMod
{
    private String id; // 主键
    private String name; // 诗人名字
    private String dynasty_id; // 诗人朝代id
    private String dynasty; // 诗人朝代
    private String introduce; // 诗人描述
    private String url; // 诗人头像

    public String getUrl()
    {
        return url;
    }

    public void setUrl(String url)
    {
        this.url = url;
    }

    public String getDynasty_id()
    {
        return dynasty_id;
    }

    public void setDynasty_id(String dynasty_id)
    {
        this.dynasty_id = dynasty_id;
    }

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getDynasty()
    {
        return dynasty;
    }

    public void setDynasty(String dynasty)
    {
        this.dynasty = dynasty;
    }

    public String getIntroduce()
    {
        return introduce;
    }

    public void setIntroduce(String introduce)
    {
        this.introduce = introduce;
    }

}
