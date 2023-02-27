<template>
  <div class="app-container">
    <p v-if="!visible">设备身份注册表单</p>
    <el-form v-else ref="form" :model="form" label-width="120px">
      <el-form-item label="工位编号">
        <el-col :span="11"> <el-input v-model="form.工位编号" /></el-col>
      </el-form-item>
      <el-form-item label="设备型号">
        <el-col :span="11"> <el-input v-model="form.设备型号" /></el-col>
      </el-form-item>
      <el-form-item label="生产厂家">
        <el-col :span="11"> <el-input v-model="form.生产厂家" /></el-col>
      </el-form-item>
      <el-form-item label="所属机构">
        <el-select
          v-model="form.所属机构"
          placeholder="please select your zone"
        >
          <el-option
            label="江苏省南京市电力科学研究院"
            value="江苏省南京市电力科学研究院"
          />
          <!-- <el-option label="Zone two" value="beijing" /> -->
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="Activity time">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="line">-</el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.date2"
              type="fixed-time"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="Instant delivery">
          <el-switch v-model="form.delivery" />
        </el-form-item> -->
      <el-form-item label="可检物资类别">
        <el-checkbox-group v-model="form.可检物资类别">
          <el-checkbox
            v-for="(value, key) in items"
            :key="key"
            :label="value"
            name="type"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="可检试验项目">
        <el-checkbox-group v-model="form.可检试验项目">
          <el-checkbox
            v-for="(value, key) in type"
            :key="key"
            :label="value"
            name="type"
          />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="联盟ID">
        <el-col :span="20"><el-input v-model="form.身份ID" /></el-col>
        <el-button type="primary" style="margin-left: 1rem" @click="generateId">
          生成ID</el-button
        >
      </el-form-item>
      <!-- <el-form-item label="公钥">
          <el-col :span="11"><el-input v-model="form.name" /></el-col>
  
          <el-button type="primary" style="margin-left: 1rem">
            生成公钥</el-button
          >
        </el-form-item> -->
      <!-- <el-form-item label="Resources">
          <el-radio-group v-model="form.resource">
            <el-radio label="Sponsor" />
            <el-radio label="Venue" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Activity form">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">设备注册</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { sha256 } from "js-sha256";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      visible: true,
      // form: {
      //   name: "",
      //   region: "",
      //   date1: "",
      //   date2: "",
      //   delivery: false,
      //   type: [],
      //   resource: "",
      //   desc: "",
      // },
      form: {
        工位编号: "A3",
        设备型号: "TM2-003",
        所属机构: "江苏省南京市电力科学研究院",
        可检物资类别: [],
        可检试验项目: [],
        生产厂家: "上海思创电气设备有限公司",
        负责人: "宋思齐",
        身份ID: "",
        // privateKey: `MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAg544VsNa20GxLA7UvzmvELY8t390Yc6+wgUQYaaNdefJChmtCHttvz9SOCk4OxkbB3xfFt+IWoFCW7jKtxD7fQIDAQABAkBQOLqsH2wcYaDkcrG3UChlLj45teSwzLu2NDH04vgr2VgDmo/2DHiKvHnF5pbxPob39nc9Kfk/RRlVRkIIy2YdAiEAupfYLrMvuNjUKQCAimo+qGQsZzJsg3uG4doLUF5Nve8CIQC0k2yVLTtCAgpb6kUp9+l5oHbN7669eAf0ESrLOcEJUwIgM+UVT++v/xX286xbE6P25zhtDQp+GZdabSgKa4C+2GsCIQCDDevkaKt1QJ3cD66awv6D813GIIoloJPFIyB31javWQIgFXqEpV7XK03IbXdHmOXSdhbOYr0B5iS3E8uHb+hT7io=`,
        公钥: "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKZAtjhCrrUcpM7ZjLkxBRTovRTb3US0VpSVw2sU9MWBIvEuOvHPBeVcWK+HbSV/9ve+DgfrZ+C8heS4C0j09LUCAwEAAQ==",
      },
      type: [
        "绕组对地及绕组间直流绝缘电阻测量——短路前",
        "绕组电阻测量——短路前",
        "电压比测量和联结组标号检定——短路前",
        "空载损耗和空载电流测量——短路前",
        "高压绕组3分接短路阻抗和负载损耗测量——短路前",
        "高压绕组1分接短路阻抗和负载损耗测量——短路前",
        "高压绕组5分接短路阻抗和负载损耗测量——短路前",
        "外施耐压试验——短路前",
        "感应耐压试验——短路前",
        "温升试验",
        "绕组对地及绕组间直流绝缘电阻测量——短路后",
        "绕组电阻测量——短路后",
        "电压比测量和联结组标号检定——短路后",
        "空载损耗和空载电流测量——短路后",
        "高压绕组3分接短路阻抗和负载损耗测量——短路后",
      ],
      items: [
        "避雷器",
        "柱上开关设备",
        "高压电缆分支箱",
        "环网柜",
        "高压开关柜",
        "隔离开关",
      ],
    };
  },
  methods: {
    onSubmit() {
      
      this.$message("注册成功");
      // console.log(sha256("sss"));
      this.$store.commit("identity/addIdentity", this.form);
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },

    generateId() {
      let str = JSON.stringify(this.form);
      console.log(sha256(str));
      this.form.身份ID = sha256(str);
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
