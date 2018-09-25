import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const FieldConfigSchemeList = asyncRouter(() => import('./fieldConfigSchemeList'), () => import('../../../stores/organization/fieldConfigScheme'));
const FieldConfigSchemeEdit = asyncRouter(() => import('./fieldConfigSchemeEdit'), () => import('../../../stores/organization/fieldConfigScheme'));
const FieldConfigSchemeCreate = asyncRouter(() => import('./fieldConfigSchemeCreate'), () => import('../../../stores/organization/fieldConfigScheme'));

const fieldConfigSchemeIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={FieldConfigSchemeList} />
    <Route exact path={`${match.url}/create`} component={FieldConfigSchemeCreate} />
    <Route exact path={`${match.url}/edit/:id`} component={FieldConfigSchemeEdit} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default fieldConfigSchemeIndex;
