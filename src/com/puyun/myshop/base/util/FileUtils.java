package com.puyun.myshop.base.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

public class FileUtils {

    private String loadFilename;

	public FileUtils() {
	}

	public FileUtils(String loadFilename) {
		this.loadFilename = loadFilename;
	}

	public String getAbsolutePath(String loadFilename) {
		ClassLoader loader = getClass().getClassLoader();
		URL url = loader.getResource(loadFilename);
		return url.getPath();
	}

	public String getAbsolutePath() {
		ClassLoader loader = getClass().getClassLoader();
		URL url = loader.getResource(loadFilename);
		return url.getPath();
	}
	public String getFilePath(String filename,int subegin) {
		String fname = getClass().getResource("/")+filename;
		if(fname.length()>subegin)
		 return (fname).substring(subegin);
		return filename+" length > parameter(subegin)";
	}

	public InputStream getInputStream() {
		ClassLoader loader = getClass().getClassLoader();
		URL url = loader.getResource(loadFilename);
		try {
			return url.openStream();
		} catch (IOException ex) {
			throw new RuntimeException(ex.getMessage(),ex);
		}
	}


    /**
     * 删除单个文件
     * @param   sPath    被删除文件的文件名
     * @return 单个文件删除成功返回true，否则返回false
     */
    public static boolean deleteFile(String sPath) {
        boolean flag = false;
        File file = new File(sPath);

        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists()) {
            file.delete();
            flag = true;
        }
        return flag;
    }
    
    /**
     * 写入内容到指定的文件,之前的内容会被新写入的覆盖
     * @param filename 文件的绝对的路径，如：c:\\a.txt
     * @param b 将被写入文件的字节数组
     * @return true：写入成功        false：写入失败
     * @throws IOException 
     * @throws Exception
     * author: ldz
     * @see [类、类#方法、类#成员]
     */
    public static boolean writeByte(String filename, String s) throws IOException
    {
        File file = new File(filename);
        if(!file.exists())
        {
            file.createNewFile();
        }
        OutputStream out = new FileOutputStream(file);
        out.write(s.getBytes("gbk"));
        out.flush();
        out.close();
        return true;
    }
    
    public static void main(String[] args) throws Exception
    {
        //创建txt文件并写入文件内容
        File file = new File("d:\\x\\说明.txt");
        if(!file.exists())
        {
            file.createNewFile();
        }
        OutputStream out = new FileOutputStream(file);
        out.write("5寸照片\r\n快点发货2".getBytes("gbk"));
        out.flush();
        out.close();
    }
}
