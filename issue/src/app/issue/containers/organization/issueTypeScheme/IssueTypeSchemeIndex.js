import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const IssueTypeSchemeList = asyncRouter(() => import('./issueTypeSchemeList'), () => import('../../../stores/organization/issueTypeScheme'));

const IssueTypeSchemeIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={IssueTypeSchemeList} />
    <Route path={'*'} component={nomatch} />
  </Switch>
);

export default IssueTypeSchemeIndex;
