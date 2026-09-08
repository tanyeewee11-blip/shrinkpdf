# ShrinkPDF — 本次完整改动汇总部署包

109个文件(含此README)。以下改动均已在这次会话中分批部署验证过——这是把所有分批zip合并成的一份完整包,方便你一次性核对/存档。**如果之前的batch1-6已经陆续部署完成,这份包内容和现状应该是一致的,不需要重复部署。**

## 改动清单

### 1. `_redirects`
补上4条漏掉的redirect规则(en-39-hr-onboarding / en-38-scholarship-application / en-36-rental-agreement / en-23-telegram 的不带.html裸URL版本),修复GSC里对应的404。

### 2. 全站内链结构(9个工具页 + index/watermark/merge/contact/guides.html)
- `index.html` +19个guide链接(7个孤儿页修复 + 14个后续批次)
- `watermark.html` +9
- `merge.html` +5
- `page-numbers.html` +8
- `split.html` +8
- `rotate.html` +8
- `pdf-to-images.html` +5
- `images-to-pdf.html` +2
- `reorder.html` +8
- 结果:95篇guide现在100%都有至少一条来自高流量工具页的内链(改动前64篇是0条)

### 3. 过时数字修正
`index.html`、`contact.html`、`guides.html` 里的guide数量统计从"52/82"改成实际的"95"。

### 4. 身份 / E-E-A-T(`about.html` + 全部95篇guide)
- `about.html`:匿名"small independent team"改成署名创始人故事(Yee Wee),配头像,加Person schema
- `founder-yee-wee.jpg`:头像图片
- 全部95篇guide:加可见署名("by Yee Wee"及本地化版本)+ author schema(Person),替换原本24篇的匿名Organization author

### 5. Schema数据清洁
8篇最早期guide(en-01/04/05/06/09/10/11/12)的HowTo step锚点URL从旧的扁平`.html`结构改成正确的`/guides/`路径。

## 部署后待办(不在这份包里,需要你手动做)
1. GSC「URL检查」对这4个页面点「请求编入索引」:
   `/guides/id-02-lpdp-beasiswa`、`/guides/id-01-kompres-pdf-gratis`、`/guides/en-50-without-adobe`、`/guides/en-30-android-no-app`
2. 3-4周后重新导出GSC Coverage + Performance + GA4快照,复查收录数和流量曲线是否回正
3. 外链投放跟进(Product Hunt/SaaSHub/Tech in Asia/awesome-list PR等)
4. Windsor.ai connector超限问题需要你去后台处理
