package com.puyun.myshop.base.util;

import java.io.File;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.iuvei.framework.util.StringUtils;

public class Utils
{

    /**
     * MD5加密
     * 
     * @param oldString
     * @return
     * @throws Exception
     */
    public static String md5Encode(String oldString)
    {
        /* 如果需要加密的字符串为空，则直接返回 */
        if (StringUtils.isBlank(oldString))
        {
            return oldString;
        }
        char hexDigits[] =
        { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
                'e', 'f' };
        byte[] strTemp = oldString.getBytes();
        MessageDigest messageDigest = null;
        try
        {
            messageDigest = MessageDigest.getInstance("MD5");
        }
        catch (NoSuchAlgorithmException e)
        {
            e.printStackTrace();
        }
        messageDigest.update(strTemp);
        byte[] mdByte = messageDigest.digest();
        int j = mdByte.length;
        char str[] = new char[j * 2];
        int k = 0;
        for (int i = 0; i < j; i++)
        {
            byte byte0 = mdByte[i];
            str[k++] = hexDigits[byte0 >>> 4 & 0xf];
            str[k++] = hexDigits[byte0 & 0xf];
        }
        return new String(str);
    }

    /**
     * 判断String类是否为空
     * 
     * @param s
     * @return
     */
    public static boolean isEmpty(String s)
    {
        return null == s || s.length() == 0 || s.equals("");
    }

    public static String token()
    {
        String _str = UUID.randomUUID().toString();
        String uid = _str.replace("-", "");
        return uid;
    }

    /**
     * 把数组转成“,”分割的字符串<br>
     * 如：[1,2,3] --> "1,2,3"
     * 
     * @param arr
     * @return
     * @see [类、类#方法、类#成员]
     */
    public static String joinString(Integer[] arr)
    {
        if (arr == null || arr.length == 0)
        {
            return "";
        }

        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < arr.length; i++)
        {
            sb.append(arr[i]).append(",");
        }
        sb.deleteCharAt(sb.length() - 1);
        return sb.toString();
    }

    public static int random6()
    {
        Random r = new Random();
        int x = r.nextInt(999999);

        if (x > 100000)
        {
            return x;
        }
        else
        {
            return random6();
        }
    }

    /**
     * 保留两位小数
     * 
     * @param f
     * @return author: ldz
     * @see [类、类#方法、类#成员]
     */
    public static String scale2(float f)
    {
        BigDecimal big = new BigDecimal(f);
        return big.setScale(2, BigDecimal.ROUND_HALF_UP).toString();
    }

    public static String getSuffix(String name)
    {
        if (name != null && name.length() > 0 && name.indexOf(".") != -1)
        {
            return name.substring(name.lastIndexOf("."));
        }
        return null;
    }

    public static void main(String[] args) throws Exception
    {

        // System.out.println("Oliver-->" + md5Encode("917745"));
        // System.out.println("Larry-->" + md5Encode("532490"));
        // System.out.println("15100123456".substring(5, 11));
        // System.out.println(md5Encode("15100123456"));
        // System.out.printf(token());

    }

    /**
     * 获取文件夹下的文件个数
     * 
     * @param folder
     *            文件夹
     * @param filter
     *            过滤的文件后缀名，过滤的后缀名的文件不计数，格式为{".txt", ".md"}
     * @return author: ldz
     * @see [类、类#方法、类#成员]
     */
    public static long getFileSize(File folder, List<String> filter)
    {
        long totalFile = 0;
        File[] filelist = folder.listFiles();
        for (int i = 0; i < filelist.length; i++)
        {
            if (filelist[i].isDirectory())
            {
                totalFile += getFileSize(filelist[i], filter);
            }
            else
            {
                if (filter != null && filter.size() > 0)
                {
                    if (!filter.contains(getSuffix(filelist[i].getName())))
                    {
                        totalFile++;
                    }
                }
                else
                {
                    totalFile++;
                }
            }
        }
        return totalFile;
    }

    public static void deleteFile(File file)
    {
        if (file.exists())
        { // 判断文件是否存在
            if (file.isFile())
            { // 判断是否是文件
                file.delete(); // delete()方法 你应该知道 是删除的意思;
            }
            else if (file.isDirectory())
            { // 否则如果它是一个目录
                File files[] = file.listFiles(); // 声明目录下所有的文件 files[];
                for (int i = 0; i < files.length; i++)
                { // 遍历目录下所有的文件
                    deleteFile(files[i]); // 把每个文件 用这个方法进行迭代
                }
            }
            file.delete();
        }
        else
        {
            System.out.println("所删除的文件不存在！" + '\n');
        }
    }

    public final static int TEL = 0;
    public final static int EMAIL = 1;
    public final static int PEN_NAME = 2;

    public static int getTypeByAccount(String account)
    {
        int type = PEN_NAME;

        Pattern patternEmail = Pattern
                .compile("^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$");
        Pattern patternTel = Pattern
                .compile("^((13[0-9])|(14[0-9])|(15[^4,\\D])|(17[0-9])|(18[0-9]))\\d{8}$");
        // Pattern p = Pattern
        // .compile("^((13[0-9])|(14[0-9])|(15[^4,\\D])|(17[0-9])|(18[0-9]))\\d{8}$");

        Matcher matcherEmail = patternEmail.matcher(account);
        Matcher matcherTel = patternTel.matcher(account);

        System.out.println(matcherEmail.matches());
        System.out.println(matcherTel.matches());
        if (matcherEmail.matches())
        {
            type = EMAIL;
        }
        else if (matcherTel.matches())
        {
            type = TEL;
        }
        else
        {
            type = PEN_NAME;
        }

        return type;

    }
}
