<template>
  <div class="app-container">
    <p v-if="!visible">区块链节点添加列表</p>
    <el-form v-else ref="form" :model="form" label-width="120px">

      <el-form-item label="节点名称">
        <el-select
          v-model="form.节点名称"
          placeholder="please select your zone"
        >
          <el-option
            v-for="item in peeroptions"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
          <!-- <el-option label="Zone two" value="beijing" /> -->
        </el-select>
      </el-form-item>

      <el-form-item label="节点类型">
        <el-select
          v-model="form.节点类型"
          placeholder="please select your node_type"
        >
          <el-option
            v-for="item in nodetype"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
          <!-- <el-option label="Zone two" value="beijing" /> -->
        </el-select>
      </el-form-item>

      <el-form-item label="所属机构">
        <el-select
          v-model="form.所属机构"
          placeholder="please select your organization"
        >
          <el-option
            v-for="item in organizations"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
          <!-- <el-option label="Zone two" value="beijing" /> -->
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="节点URL">
        <el-select
          v-model="form.节点URL"
          placeholder="please select your url"
        >
          <el-option
            v-for="item in URL"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="节点URL">
        <el-col :span="11"> <el-input v-model="form.节点URL" /></el-col>
      </el-form-item>

      <el-form-item label="创建时间" prop="createtime">
        <el-col :span="11"> <el-input v-model="form.创建时间"  /></el-col>
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

      <!-- <el-form-item label="联盟ID">
        <el-col :span="20"><el-input v-model="form.身份ID" /></el-col>
        <el-button type="primary" style="margin-left: 1rem" @click="generateId">
          生成ID</el-button
        >
      </el-form-item> -->
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
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">设备注册</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item> -->
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
      peeroptions:[{
        value:"苏北分中心peer节点",
        label:"苏北分中心peer节点"
      },{
        value:"苏南分中心peer节点",
        label:"苏南分中心peer节点"
      },{
        value:"苏中分中心peer节点",
        label:"苏中分中心peer节点"
      },{
        value:"省中心电科院peer节点",
        label:"省中心电科院peer节点"
      } ],

      nodetype:[{
        value:"PEER",
        label:"PEER"
      },{
        value:"ORDER",
        label:"ORDER"
      }],

      organizations:[{
        value:"苏北分中心",
        label:"苏北分中心"
      },{
        value:"苏南分中心",
        label:"苏南分中心"
      },{
        value:"苏中分中心",
        label:"苏中分中心"
      },{
        value:"省中心电科院",
        label:"省中心电科院"
      } ],

    //   URL:[{
    //     value:"peer0.org1.com",
    //     label:"peer0.org1.com"
    //   },{
    //     value:"peer1.org1.com",
    //     label:"peer1.org1.com"
    //   },{
    //     value:"peer0.org0.com",
    //     label:"peer0.org0.com"
    //   },{
    //     value:"peer1.org0.com",
    //     label:"peer1.org0.com"
    //   } ],
      form: {
        节点名称: "省中心（电科院）",
        节点类型: '',
        所属机构: '',   
        节点URL: "peer1.org0.com",
        创建时间:"2023-02-27",
        负责人: "宋思齐",
        身份ID: "",
        // privateKey: `MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAg544VsNa20GxLA7UvzmvELY8t390Yc6+wgUQYaaNdefJChmtCHttvz9SOCk4OxkbB3xfFt+IWoFCW7jKtxD7fQIDAQABAkBQOLqsH2wcYaDkcrG3UChlLj45teSwzLu2NDH04vgr2VgDmo/2DHiKvHnF5pbxPob39nc9Kfk/RRlVRkIIy2YdAiEAupfYLrMvuNjUKQCAimo+qGQsZzJsg3uG4doLUF5Nve8CIQC0k2yVLTtCAgpb6kUp9+l5oHbN7669eAf0ESrLOcEJUwIgM+UVT++v/xX286xbE6P25zhtDQp+GZdabSgKa4C+2GsCIQCDDevkaKt1QJ3cD66awv6D813GIIoloJPFIyB31javWQIgFXqEpV7XK03IbXdHmOXSdhbOYr0B5iS3E8uHb+hT7io=`,
        公钥: "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKZAtjhCrrUcpM7ZjLkxBRTovRTb3US0VpSVw2sU9MWBIvEuOvHPBeVcWK+HbSV/9ve+DgfrZ+C8heS4C0j09LUCAwEAAQ==",
      },
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