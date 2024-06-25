# Auto upgrade core CDK packages (AUC-CDK)


---

## Git 
#### Set git Author

```shell
./set-git-author.sh
```

#### Show git configurations
```shell
git config --list
```

#### Some variations on Git pretty log outputs
```shell
git log --pretty=oneline
```
```shell
git log --graph pretty=format\%C(yellow)%h%x09%Creset%C(cyan)%C(bold)%ad%Creset %C(yellow)%cn%Creset %C(green)%Creset %s\ date=default
```
```shell
git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(auto)%d%C(reset)' --all
```
```shell
git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(auto)%d%C(reset)%n'' %C(white)%s%C(reset) %C(dim white)- 
%an%C(reset)'
```

#### Git log statistics
```shell
git log --stat
```
