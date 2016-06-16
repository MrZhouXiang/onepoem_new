package com.puyun.myshop.test;


public class ThreadTest {
    public static Object obj = new Object();
    public static int number = 10;// 用static共享票源，不知道可以不，按理说是可以的
 
    /**
     * @param args
     */
    public static void main(String[] args) {
        // TODO Auto-generated method stub
        MyThread my = new MyThread();
        MyThread my2 = new MyThread();
        Thread t1 = new Thread(my2, "2号窗口");
        Thread t2 = new Thread(my, "1号窗口");
        t1.start();
        t2.start();
    }
 
    static class MyThread implements Runnable {
 
        public void run() {
            while (true)
                synchronized (obj) {
                    if (number > 0) {
                        System.out.println(Thread.currentThread().getName()
                                + "正在卖票," + "还剩" + number + "张票");
                        number--;
                        obj.notifyAll();
                        try {
                            obj.wait();
                        } catch (InterruptedException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        }
 
                    } else
                        break;
                }
 
        }
    }
}
