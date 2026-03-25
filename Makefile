.PHONY: help demo-up demo-down demo-status web chain deploy-local typecheck contracts-test logs clean

help:
	@printf '%s\n' \
		'make demo-up       # 后台启动本地最小 demo（hardhat + deploy + web）' \
		'make demo-down     # 停止 demo 进程' \
		'make demo-status   # 查看 demo 进程状态' \
		'make web           # 前台启动前端，日志输出到 ./logs/web.log' \
		'make chain         # 前台启动 Hardhat 本地链，日志输出到 ./logs/hardhat-node.log' \
		'make deploy-local  # 部署本地合约，日志输出到 ./logs/deploy-local.log' \
		'make typecheck     # 运行前端 typecheck' \
		'make contracts-test # 运行合约测试' \
		'make logs          # 查看日志目录' \
		'make clean         # 清理 logs 下 pid 文件'

demo-up:
	@./scripts/demo-up.sh

demo-down:
	@./scripts/demo-down.sh

demo-status:
	@./scripts/demo-status.sh

web:
	@./scripts/run-web.sh

chain:
	@./scripts/run-hardhat-node.sh

deploy-local:
	@./scripts/deploy-local.sh

typecheck:
	@./scripts/typecheck.sh

contracts-test:
	@./scripts/contracts-test.sh

logs:
	@printf 'logs directory: %s\n' "$(CURDIR)/logs"
	@ls -la logs 2>/dev/null || true

clean:
	@rm -f logs/*.pid
