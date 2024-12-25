import React from "react";
import { Tab, TabsList } from "@appsmith/ads";
import { type Action } from "entities/Action";
import { EditorTheme } from "components/editorComponents/CodeEditor/EditorConfig";
import { API_EDITOR_TABS } from "PluginActionEditor/constants/CommonApiConstants";
import { API_EDITOR_TAB_TITLES, createMessage } from "ee/constants/messages";

import useGetFormActionValues from "./hooks/useGetFormActionValues";
import { DatasourceConfig } from "./components/DatasourceConfig";
import { HintMessages } from "./HintMessages";
import { InfoFields } from "./InfoFields";
import KeyValueFieldArray from "components/editorComponents/form/fields/KeyValueFieldArray";
import ApiAuthentication from "./components/ApiAuthentication";
import { useSelectedFormTab } from "./hooks/useSelectedFormTab";
import { getHeadersCount, getParamsCount } from "./utils";
import * as Styled from "./styles";

interface Props {
  httpMethodOptions: { value: string }[];
  action: Action;
  formName: string;
  isChangePermitted: boolean;
  bodyUIComponent: React.ReactNode;
  paginationUiComponent: React.ReactNode;
  dataTestId?: string;
}

const CommonEditorForm = (props: Props) => {
  const {
    action,
    bodyUIComponent,
    formName,
    isChangePermitted,
    paginationUiComponent,
  } = props;
  const hintMessages = action.messages || [];
  const theme = EditorTheme.LIGHT;
  const {
    actionHeaders,
    actionParams,
    autoGeneratedHeaders,
    datasourceHeaders,
    datasourceParams,
  } = useGetFormActionValues();

  const [currentTab, setCurrentTab] = useSelectedFormTab();
  const headersCount = getHeadersCount(
    actionHeaders,
    datasourceHeaders,
    autoGeneratedHeaders,
  );
  const paramsCount = getParamsCount(actionParams, datasourceHeaders);

  return (
    <Styled.Tabs onValueChange={setCurrentTab} value={currentTab}>
      <Styled.FormHeader>
        <InfoFields
          actionName={action.name}
          changePermitted={props.isChangePermitted}
          formName={props.formName}
          options={props.httpMethodOptions}
          pluginId={action.pluginId}
          theme={theme}
        />
        <HintMessages hintMessages={hintMessages} />
        <TabsList>
          {Object.values(API_EDITOR_TABS)
            .filter((tab) => {
              return tab !== API_EDITOR_TABS.SETTINGS;
            })
            .map((tab) => (
              <Tab
                data-testid={`t--api-editor-${tab}`}
                key={tab}
                notificationCount={
                  tab == "HEADERS"
                    ? headersCount
                    : tab == "PARAMS"
                      ? paramsCount
                      : undefined
                }
                value={tab}
              >
                {createMessage(API_EDITOR_TAB_TITLES[tab])}
              </Tab>
            ))}
        </TabsList>
      </Styled.FormHeader>

      <Styled.TabPanel value={API_EDITOR_TABS.HEADERS}>
        <DatasourceConfig
          attributeName="header"
          autogeneratedHeaders={autoGeneratedHeaders}
          data={datasourceHeaders}
        />
        <KeyValueFieldArray
          actionConfig={actionHeaders}
          dataTreePath={`${action.name}.config.headers`}
          hideHeader
          label="Headers"
          name="actionConfiguration.headers"
          placeholder="Value"
          pushFields={isChangePermitted}
          theme={theme}
        />
      </Styled.TabPanel>
      <Styled.TabPanel value={API_EDITOR_TABS.PARAMS}>
        <DatasourceConfig attributeName={"param"} data={datasourceParams} />
        <KeyValueFieldArray
          actionConfig={actionParams}
          dataTreePath={`${action.name}.config.queryParameters`}
          hideHeader
          label="Params"
          name="actionConfiguration.queryParameters"
          pushFields={isChangePermitted}
          theme={theme}
        />
      </Styled.TabPanel>
      <Styled.TabPanel className="h-full" value={API_EDITOR_TABS.BODY}>
        {bodyUIComponent}
      </Styled.TabPanel>
      <Styled.TabPanel value={API_EDITOR_TABS.PAGINATION}>
        {paginationUiComponent}
      </Styled.TabPanel>
      <Styled.TabPanel value={API_EDITOR_TABS.AUTHENTICATION}>
        <ApiAuthentication formName={formName} />
      </Styled.TabPanel>
    </Styled.Tabs>
  );
};

export default CommonEditorForm;
