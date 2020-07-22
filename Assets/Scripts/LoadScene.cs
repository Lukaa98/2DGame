using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LoadScene : MonoBehaviour
{

    public void SceneLoader(int SceneIndex)
    {
               Time.timeScale = 1;


        SceneManager.LoadScene(SceneIndex);
                    FindObjectOfType<AudioManager>().Play("Clicking Button");


    }

}
