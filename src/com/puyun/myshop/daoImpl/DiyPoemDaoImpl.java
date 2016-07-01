package com.puyun.myshop.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import com.puyun.myshop.dao.DiyPoemDao;
import com.puyun.myshop.entity.DiyPoemMod;
import com.puyun.myshop.entity.PoemMod;

/**
 * 诗文处理
 */
public class DiyPoemDaoImpl extends BaseDaoImpl implements DiyPoemDao {
	private JdbcTemplate jdbcTemplate;

	private NamedParameterJdbcTemplate namedJdbcTemplate;

	private static final Logger logger = Logger.getLogger(DiyPoemDaoImpl.class);

	public JdbcTemplate getJdbcTemplate() {
		return this.jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.namedJdbcTemplate = new NamedParameterJdbcTemplate(
				jdbcTemplate.getDataSource());
	}

	@Override
	public List<DiyPoemMod> getDiyPoemList(int id, int size, int page,
			String tag) {

		String where = "";
		// String sql = "select * from diy_poem_t ";
		String sql = "select p.* from diy_poem_t as p join user_t as a on p.user_id = a.id ";
		String limit = " order by p.id desc limit " + size + "";
		String and = " and p.tag like '%!@#" + tag+"!@#%'";
		if (tag.trim().equals("")) {//全部
			and = "";
		}
		switch (page) {
		case -1:// 刷新
			where = "where p.id >" + id;
			break;
		case 0:// 首次
			where = "";
			break;
		case 1:// 更多
			where = "where p.id <" + id;
			break;
		default:
			break;
		}

		sql = sql + where + and + limit;
		System.out.println("sql---->" + sql);
		List<DiyPoemMod> list = jdbcTemplate.query(sql,
				new BeanPropertyRowMapper<DiyPoemMod>(DiyPoemMod.class));
		return list;
	}

	@Override
	public boolean addModel(DiyPoemMod model) {
		String sql1 = "insert into diy_poem_t(user_id,title,content,url,is_publish,creat_time,type)"
				+ "values(:user_id,:title,:content,:url,:is_publish,now(),:type)";
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		int i = this.namedJdbcTemplate.update(sql1,
				new BeanPropertySqlParameterSource(model), generatedKeyHolder);
		return i > 0 ? true : false;
	}

	@Override
	public List<DiyPoemMod> getDiyPoemList(String keyword, int start, int num) {
		String key = "%" + keyword + "%";
		String sql = "select * from diy_poem_t where title like ? order by id desc"
				+ " limit " + start + "," + num;
		List<DiyPoemMod> list = jdbcTemplate.query(sql, new Object[] { key },
				new BeanPropertyRowMapper<DiyPoemMod>(DiyPoemMod.class));
		return list;
	}

	@Override
	public DiyPoemMod getDiyPoem(int id) {
		String sql = "select * from diy_poem_t where id = ?";
		List<DiyPoemMod> list = jdbcTemplate.query(sql, new Object[] { id },
				new BeanPropertyRowMapper<DiyPoemMod>(DiyPoemMod.class));
		return list.get(0);
	}

	@Override
	public boolean updateModel(DiyPoemMod model) {
		String sql = "update diy_poem_t set author_name=:author_name,author_id=:author_id,title=:title,content=:content,url=:url "
				+ "where id=:id";
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		int num = this.namedJdbcTemplate.update(sql,
				new BeanPropertySqlParameterSource(model), generatedKeyHolder);
		return num > 0 ? true : false;
	}

	@Override
	public boolean deleteModel(int id) {
		String sql = "delete from diy_poem_t where id = " + id;
		int i = jdbcTemplate.update(sql);
		return i > 0 ? true : false;
	}
}
