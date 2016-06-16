package com.puyun.myshop.exception;

import com.iuvei.framework.exception.ZeroConfigurationRuntimeException;

public class ChamberRuntimeException extends ZeroConfigurationRuntimeException{
	
	public ChamberRuntimeException() {
		super();
	}

	public ChamberRuntimeException(String code, String[] args, Throwable cause) {
		super(code, args, cause);
	}

	public ChamberRuntimeException(String code, Throwable cause) {
		super(code, cause);
	}

	public ChamberRuntimeException(String code) {
		super(code);
	}
}
