package com.puyun.myshop.exception;

import com.iuvei.framework.exception.ZeroConfigurationException;

public class ChamberException extends ZeroConfigurationException{
	public ChamberException() {
		super();
	}

	public ChamberException(String code, String[] args, Throwable cause) {
		super(code, args, cause);
	}

	public ChamberException(String code, Throwable cause) {
		super(code, cause);
	}

	public ChamberException(String code) {
		super(code);
	}
}
