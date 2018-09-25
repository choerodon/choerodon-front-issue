import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const FieldConfigurationList = asyncRouter(() => import('./fieldConfigurationList'), () => import('../../../stores/organization/fieldConfiguration'));
const FieldConfigurationEdit = asyncRouter(() => import('./fieldConfigurationEdit'), () => import('../../../stores/organization/fieldConfiguration'));

const FieldConfigurationIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={FieldConfigurationList} />
    <Route exact path={`${match.url}/edit/:id`} component={FieldConfigurationEdit} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default FieldConfigurationIndex;
