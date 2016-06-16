package com.puyun.myshop.base;

public class Mytask implements Runnable
{
    String name;
    int time =100;
    
    public void run()
    {
        // name = Thread.currentThread().getName();
        try
        {
            Thread.sleep(time);// 模拟任务执行的时间
        }
        catch (InterruptedException e)
        {
        }
        System.out.println(name + " executed OK");
    }
    
    public Mytask()
    {
    }
    
    public Mytask(String name)
    {
        this.name = name;
    }
    
    public Mytask(String name,int time)
    {
        this.name = name;
        this.time = time;
    }
}
