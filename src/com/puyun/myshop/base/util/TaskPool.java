package com.puyun.myshop.base.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

import org.apache.log4j.Logger;

public class TaskPool
{
    private static final Logger logger = Logger.getLogger(TaskPool.class);
    /**
     * key:手机号 value:uuid
     */
    private static List<ResetPwdTask> pool = new ArrayList<ResetPwdTask>();
    
    // 时间间隔
    private static final long PERIOD_DAY = 60 * 60 * 1000;// 一小时
    
    /**
     * 添加任务并启动计时器
     * 
     * @param task
     * @see [类、类#方法、类#成员]
     */
    public static void addTask(ResetPwdTask task)
    {
//        System.out.println("addTask");
        pool.add(task);
        
        Timer timer = new Timer();
        timer.schedule(task, PERIOD_DAY);// 一小时
        TimerManager.addTimer(task.getUuid(), timer);
    }
    
    /**
     * 移除并取消任务
     * 
     * @param task
     * @return
     * @see [类、类#方法、类#成员]
     */
    public static boolean removeTask(ResetPwdTask task)
    {
        logger.debug("remove Task");
        TimerManager.cancelTimer(task.getUuid());
        return pool.remove(task);
    }
    
    /**
     * 
     * 获取任务队列中的任务,没有uuid对应的任务返回null
     * 
     * @param uuid
     * @return
     * @see [类、类#方法、类#成员]
     */
    public static ResetPwdTask getTask(String uuid)
    {
//        System.out.println("getTask");
        for (int i = 0; i < pool.size(); i++)
        {
            if (pool.get(i).getUuid().equals(uuid))
            {
                return pool.get(i);
            }
        }
        
        return null;
    }
}
