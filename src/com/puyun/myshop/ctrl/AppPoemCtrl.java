package com.puyun.myshop.ctrl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.puyun.myshop.base.Constants;
import com.puyun.myshop.base.MD5;
import com.puyun.myshop.base.util.Utils;
import com.puyun.myshop.dao.DiyPoemDao;
import com.puyun.myshop.dao.DynastyDao;
import com.puyun.myshop.dao.PoemDao;
import com.puyun.myshop.dao.UserDao;
import com.puyun.myshop.entity.DiyPoemMod;
import com.puyun.myshop.entity.DynastyMod;
import com.puyun.myshop.entity.PoemMod;
import com.puyun.myshop.entity.Result;
import com.puyun.myshop.entity.UserMod;

/**
 * 处理来自App端的请求[新]
 */
@Controller
@RequestMapping("/poem")
public class AppPoemCtrl {
	private static final Logger logger = Logger.getLogger(AppPoemCtrl.class);

	// public static Map<String, User> tokenMap = new HashMap<String, User>();
	//
	// // 下单时用于判断下单个数
	// public static Map<String, List<OrderForApp>> orderMap = new
	// HashMap<String, List<OrderForApp>>();

	@Autowired
	private PoemDao poemDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private DynastyDao dynastyDao;
	@Autowired
	private DiyPoemDao diyPoemDao;

	public AppPoemCtrl() {
		super();
		logger.debug("创建对象AppCtrl");
	}

	/**
	 * 用户发布作品
	 * 
	 * @param req
	 * @param mod
	 * @return
	 */
	@RequestMapping(value = "/publishDiyPoem")
	@ResponseBody
	public Result publishDiyPoem(HttpServletRequest req, DiyPoemMod mod) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			if (diyPoemDao.addModel(mod)) {
				result.put("id", "");
			}
			// 增加全部类型
			code = "2000";
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
		}
		return new Result(code, result);
	}

	/**
	 * 获取朝代列表
	 * 
	 * @param req
	 * @param id
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/getDynastyList")
	@ResponseBody
	public Result getDynastyList(HttpServletRequest req,
			@RequestParam(required = false, defaultValue = "-1") int id,
			@RequestParam(required = false, defaultValue = "10") int size) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			List<DynastyMod> list = dynastyDao.getDynastyList(id, size);
			// 增加全部类型
			list.add(0, new DynastyMod("0", "全部"));
			list.add(1, new DynastyMod("-1", "精选"));
			result.put("list", list);
			code = "2000";
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
		}

		return new Result(code, result);
	}

	/**
	 * 获取小诗列表
	 * 
	 * @param req
	 * @param id
	 *            第一条id
	 * @param size
	 *            大小
	 * @param page
	 *            刷新加载更多控制 -1 0 1
	 * 
	 * @param dynasty_id
	 *            作者朝代id【默认为0表示全部,-1:精选】
	 * @return
	 */
	@RequestMapping(value = "/getPoemList")
	@ResponseBody
	public Result getPoemList(HttpServletRequest req,
			@RequestParam(required = false, defaultValue = "-1") int id,
			@RequestParam(required = false, defaultValue = "10") int size,
			@RequestParam(required = false, defaultValue = "0") int page,
			@RequestParam(required = false, defaultValue = "0") int dynasty_id) {
		// List<PoemMod> list = poemDao.getPoemList(id, size, page);
		// return list;

		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			List<PoemMod> list = poemDao
					.getPoemList(id, size, page, dynasty_id);
			result.put("list", list);
			code = "2000";
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
		}

		return new Result(code, result);
	}

	/**
	 * 获取服务器路径
	 * 
	 * @param req
	 * @return
	 */
	@RequestMapping(value = "/getImgUrlPath")
	@ResponseBody
	public String getImgUrlPath(HttpServletRequest req) {
		String urlPath = req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort(); // url路径
		logger.debug("urlPath->" + urlPath + Constants.DEFAULT_MODEL_PATH);
		return urlPath;
	}

	/**
	 * 用户注册接口
	 * 
	 * @param req
	 * @param id
	 * @param size
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "/register")
	@ResponseBody
	public Result register(HttpServletRequest req, String account, String pwd) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			int type = Utils.getTypeByAccount(account);
			if (userDao.isExit(account, type)) {
				code = "4000";
				result.put("reason", "此帐号已存在, 请尝试使用其他号码注册");
				return new Result(code, result);
			}
			// todo 插入账号
			if (userDao.addOneUser(account, pwd, type)) {
				result.put("reason", "注册成功");
				code = "2000";
			} else {
				result.put("reason", "注册失败");
				code = "4000";
			}
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
			logger.error(e.getMessage(), e);
		}

		return new Result(code, result);
	}

	/**
	 * 用户注册接口
	 * 
	 * @param req
	 * @param id
	 * @param size
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "/login")
	@ResponseBody
	public Result login(HttpServletRequest req, String account, String pwd) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			int type = Utils.getTypeByAccount(account);
			if (!userDao.isExit(account, type)) {
				code = "4000";
				result.put("reason", "此帐号不存在");
				return new Result(code, result);
			}
			// todo 根据用户名和密码查找用户信息
			UserMod userMod = userDao.getOneUser(account, pwd, type);
			if (userMod != null) {
				result.put("reason", "登录成功");
				result.put("user", userMod);
				code = "2000";
			} else {
				result.put("reason", "登录失败,密码错误");
				code = "4000";
			}
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
			logger.error(e.getMessage(), e);
		}

		return new Result(code, result);
	}
	
	
	@ResponseBody
	@RequestMapping("/upload")
	public Map<String, Object> authorizeOld(
			@RequestParam(value = "photo_list", required = true) CommonsMultipartFile[] photo_list,
			HttpServletRequest request) {
		String folderName = "/../upevidences";
		Map<String, Object> map = new HashMap<String, Object>();
//		ArrayList<Info_extra_user> evidences = new ArrayList<Info_extra_user>();
		String errorMsg = "EVIDENCE_UPLOAD_FAILED";
		// 系统路径分隔符
		// String fengefu=new
		// Properties(System.getProperties()).getProperty("file.separator");
		String fengefu = "/";
		// 首先检查是否有存放照片的文件夹upevidences,如果没有系统创建
		String appPath = request.getRealPath("/");
		String folderPath = appPath + folderName;
		File file = new File(folderPath);
		if (!file.exists()) {
			file.mkdir();
		}
		for (int i = 0; i < photo_list.length; i++) {
			String originalFilename = photo_list[i].getOriginalFilename();
			String subfix = originalFilename.substring(originalFilename
					.lastIndexOf(".")); // 获取图片后缀
			String sysFileName = MD5.md5Encode(UUID.randomUUID().toString())
					+ subfix;// 系统生成的文件名
			String realFilePath = folderPath + fengefu + sysFileName;
			// MQL TODO
			String remotePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ request.getContextPath() + fengefu + folderName + fengefu
					+ sysFileName;// 访问图片的地址
			InputStream in = null;
			OutputStream out = null;
//			Info_extra_user o = new Info_extra_user();
			try {
				// 拿到上传文件的输入流
				in = (InputStream) photo_list[i].getInputStream();
				// 文件输出流
				out = new FileOutputStream(realFilePath);
				int length = 0;
				byte[] b = new byte[1024];
				while ((length = in.read(b)) > 0) {
					out.write(b, 0, length);
				}
				out.flush();
//				o.setDate_record(HttpTime.syncCurrentTime());
//				o.setDescription(remotePath);
//				o.setId_user(user_id);
//				o.setName(originalFilename);
//				o.setType(Integer.parseInt(readProperties
//						.getInfoFromProperties("EVIDENCE")));
//				evidences.add(o);
			} catch (Exception e) {
				System.out.println("上传出现问题");
//				evidences.remove(o);// 从列表中删除上传失败的类
				errorMsg += (originalFilename + " ");
			} finally {
				try {
					out.close();
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}

			}

		}
		int code = 2000;
		// 上传失败的证据集合
//		ArrayList<Info_extra_user> failedList = userService
//				.uploadEvidences(evidences);
//		// 只要不是全部上传失败，就将用户状态改为认证中
//		if (evidences.size() > failedList.size()) {
//			// 修改用户状态
//			userService.changeUserStatus(user_id);
//		}
//		if (errorMsg.equals(readProperties
//				.getInfoFromProperties("EVIDENCE_UPLOAD_FAILED"))) {// 全部上传成功
//			map.put("successMsg", readProperties
//					.getInfoFromProperties("EVIDENCE_UPLOAD_SUCCESS"));
//			// 将上传信息保存至数据库
//			for (Info_extra_user p : failedList) {
//				errorMsg += p.getDescription() + " ";
//				map.remove("successMsg");
//			}
//
//		} else {// 有上传失败的
//			code = 4016;// 操作失败
//			map.put("errorMsg", errorMsg);
//		}
		map.put("code", code);
		return map;
	}
}
