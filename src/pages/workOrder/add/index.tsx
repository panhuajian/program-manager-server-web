import { Button, Card, Input, Form, Upload, DatePicker, Steps, Result, message } from 'antd';
import {connect, Dispatch, FormattedMessage, history} from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import React, { FC, useState } from 'react';
import moment from 'moment';
import styles from '../style.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const BasicForm: FC<BasicFormProps> = (props) => {
  const { submitting, dispatch } = props;
  const [form] = Form.useForm();
  const [current, setCurrent] = useState<number>(0);
  const [fileData, setFileData] = useState();
  const [reFreshRenderArr, setReFreshRenderArr] = useState([0]);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  const handleSubmit = (): void => {
    setCurrent(current + 1)
    // form.validateFields().then(values => {
    //   const formData = new FormData();
    //   switch(current) {
    //     case 0:
    //       // Object.keys(values).forEach(item => {
    //       //   if (item === 'photo') {
    //       //     formData.append(item, values[item][0].originFileObj)
    //       //   } else if (item === 'appointmentTime') {
    //       //     formData.append(item, moment(values[item]).format())
    //       //   } else {
    //       //     formData.append(item, values[item])
    //       //   }
    //       // });
    //       // console.log(formData)
    //       dispatch({
    //         type: 'userManagement/fetchOfPost',
    //         payload: {
    //           url: '/mock/api/user-infos',
    //           body: {
    //             ...values,
    //             upload: undefined,
    //           },
    //         },
    //       }).then(({ response }): void => {
    //         if (response.status <= 300 && response.status >= 200) {
    //           setCurrent(current + 1)
    //         }
    //       })
    //       break;
    //     default:
    //   }
    //
    // }).catch(errorInfo => {
    //   console.log(errorInfo)
    // })
  }

  const statusValue = (step: number): string => {
    if (step === current) {
      return 'process'
    }
    if (step < current) {
      return 'finish'
    }
    if (step > current) {
      return 'wait'
    }
  }
  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // 返回列表页
  const backHandle = (): void => {
    history.push('/workOrder/list')
  }

  // 清空当前表单
  const clearHandle = (): void => {
    form.resetFields()
  }

  // 文件上传状态修改
  const uploadChangeHandle = (file: any): void => {
    if (file.fileList.length > 0) {
      setFileData(file.file)
    } else {
      setFileData(undefined)
    }
  }

  // 上传烧包卡
  const uploadHandle = async (): void => {
    if (!fileData) {
      message.error('请先选择文件')
    } else {
      const result = await dispatch({
        type: 'userManagement/fetchOfGet',
        payload: {
          url: '/api/upload?',
          body: {
            originFilename: fileData.name,
            resourceType: 'shaokabao'
          },
          key: 'uploadData'
        },
      })
      console.log(result)
    }
  }

  // 删除刷新模块
  const deleteHandle = (index: number): void => {
    if (reFreshRenderArr.length === 1) {
      return undefined;
    }
    const newArr = [...reFreshRenderArr];
    newArr.splice(index, 1);
    setReFreshRenderArr(newArr)
  }

  // 渲染现场刷新模块
  const refreshRender = () => {
    return reFreshRenderArr.map((item, index) => (
      <Card
        title={`模块${index+ 1}`}
        className={styles.refresh_card}
        extra={<a onClick={deleteHandle}>删除</a>}
      >
        <FormItem
          {...formItemLayout}
          label="刷新日期"
          name={`refresh[${item}].time`}
          rules={[{
            required: true,
            message: "请选择刷新日期",
          }]}
        >
          <DatePicker placeholder="请选择刷新日期"/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="现场实际运行版本"
          name={`refresh[${item}].version`}
          rules={[{
            required: true,
            message: "请输入现场实际运行版本",
          }]}
        >
          <Input placeholder="请输入现场实际运行版本"/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="风机号"
          name={`refresh[${item}].number`}
          rules={[{
            required: true,
            message: "请输入风机号",
          }]}
        >
          <Input placeholder="请输入风机号"/>
        </FormItem>
        < FormItem
          {...formItemLayout}
          label="特殊配置"
          name={`refresh[${item}].configuration`}
          rules={[{
            required: true,
            message: "请输入特殊配置",
          }]}
        >
          <TextArea rows={4} placeholder="请输入特殊配置"/>
        </FormItem>
      </Card>
    ))
  }

  // 刷新页面添加按钮
  const addHandle = (): void => {
    const newArr = [...reFreshRenderArr, reFreshRenderArr[reFreshRenderArr.length - 1] + 1];
    setReFreshRenderArr(newArr)
  }

  return (
    <Card bordered={false}>
      <Steps
        type="navigation"
        current={current}
        className={styles.work_order_steps}
      >
        <Step status={statusValue(0)} title="程序发布" />
        <Step status={statusValue(1)} title="指派现场" />
        <Step status={statusValue(2)} title="现场刷新" />
        <Step status={statusValue(3)} title="运行反馈" />
        <Step status={statusValue(4)} title="结果分析" />
        <Step status={statusValue(5)} title="任务完成" />
      </Steps>
        <Form
          style={{marginTop: 8}}
          form={form}
          name="basic"
          initialValues={{public: '1'}}
        >
          {/*程序发布*/}
          {current === 0 &&
            <>
              <FormItem
                {...formItemLayout}
                label="项目名称"
                name="department"
                rules={[{
                  required: true,
                  message: "请输入项目名称",
                }]}
              >
                <Input placeholder="请输入项目名称"/>
              </FormItem>
              < FormItem
                {...formItemLayout}
                label="需求信息"
                name="name"
                rules={[{
                  required: true,
                  message: "请输入需求信息",
                }]}
                >
                <TextArea rows={4} placeholder="请输入需求信息"/>
                </FormItem>
              <FormItem
                {...formItemLayout}
                name="upload"
                label="烧卡包"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Button type="primary" className={styles.margin_right_20} onClick={uploadHandle}>上传</Button>
                <Upload
                  onChange={uploadChangeHandle}
                >
                  <Button>
                    <UploadOutlined /> 选择
                  </Button>
                </Upload>
              </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="初始化版本"
                  name="phoneNum"
                  rules={[{
                    required: true,
                    message: "请输入初始化版本",
                  }]}
                >
                <Input placeholder="请输入初始化版本"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="优化基础版"
                  name="telNum"
                  rules={[{
                    required: true,
                    message: "请输入优化基础版",
                  }]}
                >
                <Input placeholder="请输入优化基础版"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="优化内容"
                  name="password"
                  rules={[{
                    required: true,
                    message: "请输入优化内容",
                  }]}
                >
                <TextArea rows={4} placeholder="请输入优化内容"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="测试人员"
                  name="telNum"
                  rules={[{
                    required: true,
                    message: "请输入测试人员",
                  }]}
                >
                <Input placeholder="请输入测试人员"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="运维技术部"
                  name="telNum"
                  rules={[{
                    required: true,
                    message: "请输入运维技术部",
                  }]}
                >
                <Input placeholder="请输入运维技术部"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="刷新注意事项"
                  name="telNum"
                  rules={[{
                    required: true,
                    message: "请输入刷新注意事项",
                  }]}
                >
                <TextArea rows={4} placeholder="请输入刷新注意事项"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="数据反馈需求"
                  name="telNum"
                  rules={[{
                    required: true,
                    message: "请输入数据反馈需求",
                  }]}
                >
                <TextArea rows={4} placeholder="请输入数据反馈需求"/>
                </FormItem>
            </>
          }
          {/*指派现场*/}
          {current === 1 &&
            <>
              <FormItem
                {...formItemLayout}
                label="现场人员"
                name="department"
                rules={[{
                  required: true,
                  message: "请输入现场人员",
                }]}
              >
                <Input placeholder="请输入现场人员"/>
              </FormItem>
              < FormItem
                {...formItemLayout}
                label="描述信息"
                name="name"
                rules={[{
                  required: true,
                  message: "请输入描述信息",
                }]}
              >
                <TextArea rows={4} placeholder="请输入描述信息"/>
              </FormItem>
            </>
          }
          {/*现场刷新*/}
          {current === 2 &&
            <>
              {refreshRender()}
              <Button
                type="primary"
                className={styles.margin_top_20}
                onClick={addHandle}
              >添加</Button>
            </>
          }
          {/*运行反馈*/}
          {current === 3 &&
            <>
              < FormItem
                {...formItemLayout}
                label="反馈信息"
                name="name"
                rules={[{
                  required: true,
                  message: "请输入反馈信息",
                }]}
              >
                <TextArea rows={4} placeholder="请输入反馈信息"/>
              </FormItem>
            </>
          }
          {/*结果分析*/}
          {current === 4 &&
            <>
              < FormItem
                {...formItemLayout}
                label="结果分析"
                name="name"
                rules={[{
                  required: true,
                  message: "请输入结果分析",
                }]}
              >
                <TextArea rows={4} placeholder="请输入结果分析"/>
              </FormItem>
            </>
          }
          {/*任务完成*/}
          {current === 5 &&
            <Result
              status="success"
              title="任务完成"
              extra={[
                <Button type="primary" onClick={backHandle}>返回列表页</Button>,
              ]}
            />
          }
          {current !== 5 &&
            <FormItem {...submitFormLayout} style={{marginTop: 32}}>
              <Button
                type="primary"
                loading={submitting}
                onClick={handleSubmit}
                className={styles.margin_right_20}
              >
                提交
              </Button>
              <Button type="primary" onClick={clearHandle}>清空</Button>
            </FormItem>
          }
        </Form>
    </Card>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['userManagement/submitRegularForm'],
}))(BasicForm);
