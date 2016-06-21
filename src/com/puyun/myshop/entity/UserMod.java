package com.puyun.myshop.entity;

import org.codehaus.jackson.annotate.JsonIgnore;

/**
 * 用户
 * 
 * @author zx
 */
public class UserMod
{
    private String id;// 用户ID
    private String pen_name;// 笔名
    private String tel;// 手机号
    private String email;// 邮箱
    private String url;// 头像
    private int money;// 墨汁【充值】
    
    

    public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	public String getUrl()
    {
        return url;
    }

    public void setUrl(String url)
    {
        this.url = url;
    }

    public String getPen_name()
    {
        return pen_name;
    }

    public void setPen_name(String pen_name)
    {
        this.pen_name = pen_name;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    @JsonIgnore
    private String password;// 密码（MD5加密）

    public UserMod()
    {
        super();
    }

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getTel()
    {
        return tel;
    }

    public void setTel(String tel)
    {
        this.tel = tel;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

}
