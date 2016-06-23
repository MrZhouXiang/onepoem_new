package com.puyun.myshop.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import com.puyun.myshop.dao.PoemDao;
import com.puyun.myshop.entity.PoemMod;

/**
 * 诗文处理
 */
public class DiyPoemDaoImpl extends BaseDaoImpl implements PoemDao {
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
	public List<PoemMod> getPoemList(int id, int size, int page, int dynasty_id) {

		String where = "";
		// String sql = "select * from poem_t ";
		String sql = "select p.* from poem_t as p join author_t as a on p.author_id = a.id ";
		String limit = " order by p.id desc limit " + size + "";
		String and = " and a.dynasty_id = " + dynasty_id;
		if (dynasty_id == 0) {
			and = "";
		}
		if (dynasty_id == -1) {// 获取精选
			and = " and p.status = " + 2;
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
		List<PoemMod> list = jdbcTemplate.query(sql,
				new BeanPropertyRowMapper<PoemMod>(PoemMod.class));
		return list;
	}

	@Override
	public boolean addModel(PoemMod model) {
		String sql1 = "insert into poem_t(author_id,author_name,title,content,url)"
				+ "values(:author_id,:author_name,:title,:content,:url)";
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		int i = this.namedJdbcTemplate.update(sql1,
				new BeanPropertySqlParameterSource(model), generatedKeyHolder);
		return i > 0 ? true : false;
	}

	@Override
	public List<PoemMod> getPoemList(String keyword, int start, int num) {
		String key = "%" + keyword + "%";
		String sql = "select * from poem_t where title like ? order by id desc"
				+ " limit " + start + "," + num;
		List<PoemMod> list = jdbcTemplate.query(sql, new Object[] { key },
				new BeanPropertyRowMapper<PoemMod>(PoemMod.class));
		return list;
	}

	@Override
	public PoemMod getPoem(int id) {
		String sql = "select * from poem_t where id = ?";
		List<PoemMod> list = jdbcTemplate.query(sql, new Object[] { id },
				new BeanPropertyRowMapper<PoemMod>(PoemMod.class));
		return list.get(0);
	}

	@Override
	public boolean updateModel(PoemMod model) {
		String sql = "update poem_t set author_name=:author_name,author_id=:author_id,title=:title,content=:content,url=:url "
				+ "where id=:id";
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		int num = this.namedJdbcTemplate.update(sql,
				new BeanPropertySqlParameterSource(model), generatedKeyHolder);
		return num > 0 ? true : false;
	}

	@Override
	public boolean deleteModel(int id) {
		String sql = "delete from poem_t where id = " + id;
		int i = jdbcTemplate.update(sql);
		return i > 0 ? true : false;
	}
}
