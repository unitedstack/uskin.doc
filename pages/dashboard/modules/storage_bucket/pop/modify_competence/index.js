import {ModalV2} from 'ufec';
import config from './config';
import  __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function getAcl(acls) {
  if (acls[0] === 'authenticated-read') {
    return 'authenticated-read';
  } else if (acls.length > 1) {
    return 'public-read-write';
  } else if (acls.length === 1){
    return 'public-read';
  } else {
    return 'private';
  }
}

function pop(obj, parent, callback) {
  let props = {
    __: __,
    parent: parent,
    config: config,
    width: 600,
    onInitialize: function(form, updateFields) {
      const publicAccess = [{
        id: 'private',
        name: __.private
      }, {
        id: 'public-read',
        name: __.public_read
      }, {
        id: 'public-read-write',
        name: __.public_read_write
      }, {
        id: 'authenticated-read',
        name: __.authenticated_read
      }];

      const options = [{
        value: 'read',
        label: __.read
      }, {
        value: 'write',
        label: __.write
      }, {
        value: 'read_acp',
        label: __.read_acl
      }, {
        value: 'write_acp',
        label: __.write_acl
      }];

      request.getAcl(obj.bucket).then(res => {
        let value = [], initData = [], ids = [],
          url = [];

        function getCompetence(permission) {
          switch(permission) {
            case 'full_control':
              return ['write_acp', 'read', 'write', 'read_acp'];
            default:
              return [permission];
          }
        }


        res.Grants.forEach(gr => {
          if (gr.Grantee.Type === 'Group') {
            url = gr.Grantee.URI.split('/');
            if (url[url.length - 1] === 'AuthenticatedUsers') {
              value.push('authenticated-read');
            } else {
              value.push(gr.Permission.toLowerCase());
            }
          } else {
            if (ids.indexOf(gr.Grantee.ID) !== -1) {
              initData[ids.indexOf(gr.Grantee.ID)].competence =
                initData[ids.indexOf(gr.Grantee.ID)].competence.concat(getCompetence(gr.Permission.toLowerCase()));
            } else {
              ids.push(gr.Grantee.ID);
              initData.push({
                'user_name': gr.Grantee.DisplayName,
                competence: getCompetence(gr.Permission.toLowerCase())
              });
            }
          }
        });

        request.getUserList().then(user => {
          let userData = user.data.filter(user => !initData.some(init => init.user_name === user.user_id));

          updateFields({
            specific_access: {
              initData: initData,
              options: options,
              userData: userData,
              nameType: 'user_id',
              decorator: {
                id: 'specific_access',
                initialValue: {
                  initData: initData,
                  allData: []
                }
              }
            },
            public_access: {
              data: publicAccess
            }
          });
          form.setFields({
            public_access: {
              value: getAcl(value)
            }
          });
        });
      });
    },
    onConfirm: function(values, cb) {
      let grants = [];
      let data = {
        Bucket: obj.bucket,
        AccessControlPolicy: {
          Owner: {
            DisplayName: obj.owner,
            ID: obj.owner
          }
        }
      };

      switch(values.public_access) {
        case 'public-read':
          grants.push({
            Grantee: {
              Type: 'Group',
              URI: 'http://acs.amazonaws.com/groups/global/AllUsers'
            },
            Permission: 'READ'
          });
          break;
        case 'public-read-write':
          ['READ', 'WRITE'].forEach(m => {
            grants.push({
              Grantee: {
                Type: 'Group',
                URI: 'http://acs.amazonaws.com/groups/global/AllUsers'
              },
              Permission: m
            });
          });
          break;
        case 'authenticated-read':
          grants.push({
            Grantee: {
              Type: 'Group',
              URI: 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers'
            },
            Permission: 'READ'
          });
          break;
        default:
          break;
      }

      let initData = values.specific_access.initData,
        allData = values.specific_access.allData;

      let conData = initData.concat(allData ? allData : []);

      conData.forEach(cd => {
        if (cd.user_name) {
          if (cd.competence.length === 4) {
            grants.push({
              Grantee: {
                Type: 'CanonicalUser',
                DisplayName: cd.user_name,
                ID: cd.user_name
              },
              Permission: 'FULL_CONTROL'
            });
          } else if (cd.competence.length !== 0) {
            cd.competence.forEach(com => {
              grants.push({
                Grantee: {
                  Type: 'CanonicalUser',
                  DisplayName: cd.user_name,
                  ID: cd.user_name
                },
                Permission: com.toString().toUpperCase()
              });
            });
          }
        }
      });

      data.AccessControlPolicy.Grants = grants;

      request.updateAcl(data).then(res => {
        cb(true);
        callback && callback();
      }).catch(error => cb(false, getErrorMessage(error)));

    }
  };

  ModalV2(props);
}

export default pop;
