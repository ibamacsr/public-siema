<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/*
 * This file is part of AuthLDAP.

 AuthLDAP is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 AuthLDAP is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with AuthLDAP. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * @authors     Greg Wojtak <gwojtak@techrockdo.com>, Helmuth Saatkamp <helmuthdu@gmail.com>
 * @copyright   Copyright © 2010-2013 by Greg Wojtak <gwojtak@techrockdo.com>
 * @package     AuthLDAP
 * @license     GNU Lesser General Public License
 */
class Auth extends CI_Controller {
    function __construct() {
        parent::__construct();

        $this->load->helper('form');
        $this->load->library('Form_validation');
        $this->load->library('AuthLDAP');
        $this->load->library('Firephp');
        $this->load->helper('url');
        $this->load->model('Home_model');
    }

    function index() {
        $this->session->keep_flashdata('tried_to');
        $this->login();
    }


    function login_ibama($errorMsg = NULL){
        $this->session->keep_flashdata('tried_to');
        if(!$this->authldap->is_authenticated()) {
            // Set up rules for form validation
            $rules = $this->form_validation;
            $rules->set_rules('inputUsername', 'Username', 'required|alpha_dash');
            $rules->set_rules('inputPassword', 'Password', 'required');

            // Do the login...
            if($rules->run() && $this->authldap->login(
                $rules->set_value('inputUsername'),
                $rules->set_value('inputPassword'))) {

                    //Save profiler(perfil) user in session.
                    $this->save_profile_user($rules->set_value('inputUsername'));

                    // Login WIN!
                    if($this->session->flashdata('tried_to')) {
                        redirect($this->session->flashdata('tried_to'));
                    } else {
                        $this->load->view('pages/login_ibama');

                    }
                }
            else {
                // Login FAIL
                $this->load->view('pages/login_ibama', array('login_fail_msg'
                    => 'Error with LDAP authentication.'));
            }
        } else {
            // Already logged in...
            $this->load->view('pages/login_ibama');
        }
    }


    function login_empresa($errorMsg = NULL){
        $this->session->keep_flashdata('tried_to');
        // if(!$this->authldap->is_authenticated()) {
        if(!$this->session->userdata('logged_in')) {

            // CODE FOR ACCESSING CNT DATABASE


            // Selecting the num_pessoa from the cnt database

            $conn = oci_connect('sisreg', 'sisregdes', 'exd01-scan.ibama.gov.br/dsnv_manut');
            if (!$conn) {
                $e = oci_error();
                $this->firephp->log($e);
            } // end iF;

            // Creating pl/sql function
            $sql = 'begin


                        :erro := sisreg.pkg_pessoa_base.sel_pessoa( p_cursor        => :p_cursor
                                                                   ,p_cpf_cnpj_nome => :p_cpf_cnpj_nome );
                     end;';

            if (!$p_str = oci_parse($conn,$sql)) {
                $this->firephp->log(oci_error($conn));
                oci_close($conn);
            };

            $p_cpf_cnpj_nome = $_POST[ 'inputUsername' ];

            // Data Binding in variables
            oci_bind_by_name( $p_str, ":p_cpf_cnpj_nome", $p_cpf_cnpj_nome, 20);

            // Data Binding out variables
            $p_cursor = oci_new_cursor($conn);
            oci_bind_by_name($p_str,':p_cursor',$p_cursor,-1,OCI_B_CURSOR);
            oci_bind_by_name($p_str,":erro",$erro,250);

            // Execute
            $r = oci_execute($p_str,OCI_DEFAULT);
            if ( !$r ) {
                $e = oci_error($p_str);
                oci_close($conn);
                $this->firephp->log($e);
            }

            //Execute Cursor
            if ( !oci_execute($p_cursor,OCI_DEFAULT) ) {
                $e = oci_error($p_str);
                oci_free_statement($p_str);
                oci_close($conn);
                $this->firephp->log($e);
            }


            oci_fetch_all($p_cursor, $data);

            // $this->firephp->log($data);


            // Actually authenticating the user

            $sql = 'begin
                        :erro := sisreg.pkg_pessoa_base.autenticar( p_num_pessoa        => :p_num_pessoa
                                                                   ,p_senha             => :p_senha
                                                                   ,p_seq_app_modulo    => :p_seq_app_modulo);
                     end;';

            if (!$p_str = oci_parse($conn,$sql)) {
                $this->firephp->log(oci_error($conn));
                oci_close($conn);
            };

            $p_senha = $_POST[ 'inputPassword' ];
            $num_pessoa = (int) $data['NUM_PESSOA'][0];
            $p_seq_app_modulo = 10144;  // Our app_modulo squence

            // Data Binding in variables
            oci_bind_by_name( $p_str, ":p_num_pessoa", $num_pessoa );
            oci_bind_by_name( $p_str, ":p_senha", $p_senha );

            // Data Binding out variables
            oci_bind_by_name($p_str,':p_seq_app_modulo',$p_seq_app_modulo,25);
            oci_bind_by_name($p_str,":erro",$erro,250);

            // Execute
            $r = oci_execute($p_str,OCI_DEFAULT);
            if ( !$r ) {
                $e = oci_error($p_str);
                oci_close($conn);
                $this->firephp->log($e);
            }

            // $this->firephp->log($p_seq_app_modulo);

            oci_free_statement($p_cursor);
            oci_free_statement($p_str);
            oci_close($conn);


            if($p_seq_app_modulo == 10144) {
                $userArray = array(
                    'logged_in' => TRUE,
                    'name'      => ucwords(strtolower($data['Nome'][0])),
                    'cpf'       => $data['CNPJ_CPF'][0]
                    );
                $this->session->set_userdata($userArray);
                if($this->session->flashdata('tried_to')) {
                    redirect($this->session->flashdata('tried_to'));
                } else {
                    $this->load->view('pages/login_ibama');
                }

            } else {
                $this->load->view('pages/login_empresa');
            }

            // CODE FOR ACCESSING CNT DATABASE



            // // Set up rules for form validation
            // $rules = $this->form_validation;
            // $rules->set_rules('inputUsername', 'Username', 'required|alpha_dash');
            // $rules->set_rules('inputPassword', 'Password', 'required');

            // // Do the login...
            // if($rules->run() && $this->authldap->login(
            //     $rules->set_value('inputUsername'),
            //     $rules->set_value('inputPassword'))) {

            //         //Save profiler(perfil) user in session.
            //         $this->save_profile_user($rules->set_value('inputUsername'));

            //         // Login WIN!
            //         if($this->session->flashdata('tried_to')) {
            //             redirect($this->session->flashdata('tried_to'));
            //         } else {
            //             $this->load->view('pages/login_empresa');

            //         }
            //     }
            // else {
            //     // Login FAIL
            //     $this->load->view('pages/login_empresa', array('login_fail_msg'
            //         => 'Error with LDAP authentication.'));
            // }
        } else {
            // Already logged in...
            $this->load->view('pages/login_empresa');
        }
    }

    function login_site($errorMsg = NULL){
        $this->session->keep_flashdata('tried_to');
        if(!$this->authldap->is_authenticated()) {
            // Set up rules for form validation
            $rules = $this->form_validation;
            $rules->set_rules('inputUsername', 'Username', 'required|alpha_dash');
            $rules->set_rules('inputPassword', 'Password', 'required');

            // Do the login...
            if($rules->run() && $this->authldap->login(
                $rules->set_value('inputUsername'),
                $rules->set_value('inputPassword'))) {

                    //Save profiler(perfil) user in session.
                    $this->save_profile_user($rules->set_value('inputUsername'));

                    // Login WIN!
                    if($this->session->flashdata('tried_to')) {
                        redirect($this->session->flashdata('tried_to'));
                    } else {
                        redirect(base_url());
                    }
                }
            else {
                // Login FAIL
                $this->load->view('pages/login', array('login_fail_msg'
                    => 'Error with LDAP authentication.'));
            }
        } else {
            // Already logged in...
            $this->load->view('pages/login');
        }
    }

    function logout() {

        if($this->session->userdata('logged_in')) {
            $this->authldap->logout();
        } else {
            $this->session->set_userdata(array('logged_in' => FALSE));
            $this->session->set_userdata("profile_user",0);
        }

        redirect(base_url());
    }

       /*
    Save in session the profile(perfil) of user.
    */
    function save_profile_user($userName)
    {
        //Start Session.
        $this->session->set_userdata("profile_user",0);

        //Get profile user.
        $profileUser = $this->Home_model->getProfileUser($userName);

        //Save profile in session.
        $this->session->set_userdata("profile_user",$profileUser);
    }


}
