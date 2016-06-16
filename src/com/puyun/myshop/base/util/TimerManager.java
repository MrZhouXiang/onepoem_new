package com.puyun.myshop.base.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;

public class TimerManager
{
    private static Map<String,Timer> timerList= new HashMap<String,Timer>();
    
    /**
     * 计时器个数
     * @return
     * @see [类、类#方法、类#成员]
     */
    public static int size()
    {
        return timerList.size();
    }
    
    /**
     * 新增计时器
     * @param uuid
     * @param timer
     * @see [类、类#方法、类#成员]
     */
    public static void addTimer(String uuid,Timer timer){
//        System.out.println("addTimer");
        timerList.put(uuid,timer);
    }
    
    /**
     * 取消计时器
     * @param uuid
     * @see [类、类#方法、类#成员]
     */
    public static void cancelTimer(String uuid)
    {
        timerList.remove(uuid).cancel();
    }
    
    /**
     * 清空并取消所有计时器
     * @see [类、类#方法、类#成员]
     */
    public static void clearAll()
    {
        for (int i = 0; i < timerList.size(); i++)
        {
            timerList.remove(0).cancel();
        }
    }
}
